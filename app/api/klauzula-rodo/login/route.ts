import {
  createSessionToken,
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  sessionCookieOptions,
  verifyPassword,
} from "@/lib/klauzula/auth";
import { clientKey, isSameOrigin, json, rateLimit, readJson, sleep } from "@/lib/klauzula/guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return json({ error: "Niedozwolone żądanie." }, 403);

  const limit = rateLimit(`login:${clientKey(request)}`, 8, 10 * 60_000);
  if (!limit.allowed) {
    return json(
      { error: `Zbyt wiele prób logowania. Spróbuj ponownie za ${Math.ceil(limit.retryAfterSeconds / 60)} min.` },
      429,
      { "Retry-After": String(limit.retryAfterSeconds) }
    );
  }

  if (!process.env.KLAUZULA_PASSWORD_HASH || (process.env.KLAUZULA_SESSION_SECRET ?? "").length < 32) {
    console.error("klauzula-rodo: login attempted but KLAUZULA_PASSWORD_HASH / KLAUZULA_SESSION_SECRET are not configured");
    return json({ error: "Strona nie jest jeszcze skonfigurowana." }, 503);
  }

  const body = await readJson(request, 2_000);
  if (!body.ok) return body.response;
  const password = (body.data as { password?: unknown } | null)?.password;

  if (!(await verifyPassword(password))) {
    await sleep(700); // slows down guessing even when the in-memory limit is bypassed
    return json({ error: "Nieprawidłowe hasło." }, 401);
  }

  const response = json({ ok: true });
  response.cookies.set({
    name: SESSION_COOKIE,
    value: createSessionToken(),
    maxAge: SESSION_TTL_SECONDS,
    ...sessionCookieOptions,
  });
  return response;
}
