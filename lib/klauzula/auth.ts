import { createHmac, randomBytes, scrypt, timingSafeEqual, type ScryptOptions } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Password gate for the internal /klauzula-rodo page.
 *
 *  - The password is only ever checked on the server, against a scrypt hash
 *    kept in KLAUZULA_PASSWORD_HASH (never the plain password).
 *  - A successful login sets a signed, stateless session cookie
 *    (httpOnly, Secure in production, SameSite=Strict, 12 h).
 *  - Every state-changing endpoint calls getSession() and refuses without it.
 */

export const SESSION_COOKIE = "klauzula_session";
export const SESSION_TTL_SECONDS = 12 * 60 * 60;
export const MAX_PASSWORD_LENGTH = 200;

const SCRYPT = { N: 16384, r: 8, p: 1, keyLength: 64 } as const;

function scryptAsync(password: string, salt: Buffer, keyLength: number, options: ScryptOptions) {
  return new Promise<Buffer>((resolve, reject) => {
    scrypt(password, salt, keyLength, options, (error, key) => (error ? reject(error) : resolve(key)));
  });
}

/** Produces the value to put in KLAUZULA_PASSWORD_HASH. */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await scryptAsync(password, salt, SCRYPT.keyLength, { N: SCRYPT.N, r: SCRYPT.r, p: SCRYPT.p });
  // ":" (not "$") as separator and base64url: the value goes into .env files and
  // Vercel settings, where "$" would be treated as a variable reference.
  return ["scrypt", SCRYPT.N, SCRYPT.r, SCRYPT.p, salt.toString("base64url"), key.toString("base64url")].join(":");
}

export async function verifyPassword(password: unknown, stored = process.env.KLAUZULA_PASSWORD_HASH): Promise<boolean> {
  if (typeof password !== "string" || !password || password.length > MAX_PASSWORD_LENGTH) return false;
  if (!stored) return false;
  const [scheme, n, r, p, saltB64, keyB64] = stored.split(":");
  if (scheme !== "scrypt" || !saltB64 || !keyB64) return false;
  const expected = Buffer.from(keyB64, "base64url");
  const params = { N: Number(n), r: Number(r), p: Number(p) };
  if (!expected.length || ![params.N, params.r, params.p].every(Number.isFinite)) return false;
  try {
    const actual = await scryptAsync(password, Buffer.from(saltB64, "base64url"), expected.length, params);
    return timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

// ── Signed values (session token, signature timestamps) ──────────────────

function secret(): string {
  const value = process.env.KLAUZULA_SESSION_SECRET;
  if (!value || value.length < 32) throw new Error("KLAUZULA_SESSION_SECRET is missing or shorter than 32 characters.");
  return value;
}

export function hmac(purpose: string, data: string): string {
  const key = createHmac("sha256", secret()).update(`klauzula:${purpose}`).digest();
  return createHmac("sha256", key).update(data).digest("base64url");
}

export function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export type Session = { sid: string; exp: number };

export function createSessionToken(nowMs = Date.now()): string {
  const payload: Session = {
    sid: randomBytes(16).toString("base64url"),
    exp: Math.floor(nowMs / 1000) + SESSION_TTL_SECONDS,
  };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `v1.${body}.${hmac("session", `v1.${body}`)}`;
}

export function verifySessionToken(token: string | undefined, nowMs = Date.now()): Session | null {
  if (!token) return null;
  const [version, body, signature] = token.split(".");
  if (version !== "v1" || !body || !signature) return null;
  try {
    if (!safeEqual(signature, hmac("session", `v1.${body}`))) return null;
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as Partial<Session>;
    if (typeof payload.sid !== "string" || typeof payload.exp !== "number") return null;
    return payload.exp * 1000 > nowMs ? { sid: payload.sid, exp: payload.exp } : null;
  } catch {
    return null;
  }
}

/** Reads the session from the request cookies (route handlers and server components). */
export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
};
