import { beforeAll, describe, expect, it } from "vitest";
import {
  createSessionToken,
  hashPassword,
  SESSION_TTL_SECONDS,
  verifyPassword,
  verifySessionToken,
} from "@/lib/klauzula/auth";
import { issueStamp, STAMP_MAX_AGE_MS, verifyStamp } from "@/lib/klauzula/stamp";
import { isSameOrigin, rateLimit } from "@/lib/klauzula/guard";

beforeAll(() => {
  process.env.KLAUZULA_SESSION_SECRET = "test-secret-".padEnd(48, "x");
});

describe("password hashing", () => {
  it("accepts the right password and rejects others", async () => {
    const stored = await hashPassword("correct horse battery staple");
    expect(stored.startsWith("scrypt:")).toBe(true);
    expect(await verifyPassword("correct horse battery staple", stored)).toBe(true);
    expect(await verifyPassword("correct horse battery stapl", stored)).toBe(false);
    expect(await verifyPassword("", stored)).toBe(false);
    expect(await verifyPassword(undefined, stored)).toBe(false);
    expect(await verifyPassword("x".repeat(500), stored)).toBe(false);
  });

  it("accepts hashes made by scripts/klauzula-hash-password.mjs and keeps them free of '$'", async () => {
    const { hashPassword: scriptHash, generateSecret } = await import("../../scripts/klauzula-hash-password.mjs");
    const stored = await scriptHash("hasło-z-polskimi-znakami-żółć");
    expect(stored).not.toContain("$"); // would be expanded as a variable in .env files
    expect(await verifyPassword("hasło-z-polskimi-znakami-żółć", stored)).toBe(true);
    expect(await verifyPassword("inne", stored)).toBe(false);
    expect(generateSecret().length).toBeGreaterThanOrEqual(32);
    expect(generateSecret()).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  it("uses a random salt", async () => {
    expect(await hashPassword("same")).not.toBe(await hashPassword("same"));
  });

  it("fails closed on missing or malformed hashes", async () => {
    expect(await verifyPassword("anything", undefined)).toBe(false);
    expect(await verifyPassword("anything", "")).toBe(false);
    expect(await verifyPassword("anything", "plaintext")).toBe(false);
    expect(await verifyPassword("anything", "scrypt:a:b:c:d:e")).toBe(false);
  });
});

describe("session token", () => {
  const now = Date.UTC(2026, 8, 19, 12, 0, 0);

  it("round-trips and lasts 12 hours", () => {
    const token = createSessionToken(now);
    expect(SESSION_TTL_SECONDS).toBe(12 * 3600);
    const session = verifySessionToken(token, now + 11 * 3600 * 1000);
    expect(session?.sid).toBeTruthy();
    expect(verifySessionToken(token, now + 12 * 3600 * 1000 + 1000)).toBeNull();
  });

  it("rejects tampering and garbage", () => {
    const token = createSessionToken(now);
    const [v, body, sig] = token.split(".");
    const forged = Buffer.from(JSON.stringify({ sid: "attacker", exp: 9999999999 })).toString("base64url");
    expect(verifySessionToken(`${v}.${forged}.${sig}`, now)).toBeNull();
    expect(verifySessionToken(`${v}.${body}.${sig.slice(0, -2)}xx`, now)).toBeNull();
    expect(verifySessionToken(undefined, now)).toBeNull();
    expect(verifySessionToken("", now)).toBeNull();
    expect(verifySessionToken("v1.a.b", now)).toBeNull();
    expect(verifySessionToken("nonsense", now)).toBeNull();
  });

  it("is invalid under a different secret", () => {
    const token = createSessionToken(now);
    const original = process.env.KLAUZULA_SESSION_SECRET;
    process.env.KLAUZULA_SESSION_SECRET = "another-secret-".padEnd(48, "y");
    expect(verifySessionToken(token, now)).toBeNull();
    process.env.KLAUZULA_SESSION_SECRET = original;
  });
});

describe("signature stamps", () => {
  const hash = "a".repeat(64);
  const now = new Date("2026-09-19T12:00:00Z");

  it("verifies a genuine, fresh stamp", () => {
    const { at, mac } = issueStamp("sid-1", 1, hash, now);
    expect(verifyStamp("sid-1", 1, hash, at, mac, now.getTime() + 60_000)?.toISOString()).toBe(at);
  });

  it("binds the stamp to session, slot, image and time", () => {
    const { at, mac } = issueStamp("sid-1", 1, hash, now);
    const later = now.getTime() + 1000;
    expect(verifyStamp("sid-2", 1, hash, at, mac, later)).toBeNull();
    expect(verifyStamp("sid-1", 2, hash, at, mac, later)).toBeNull();
    expect(verifyStamp("sid-1", 1, "b".repeat(64), at, mac, later)).toBeNull();
    expect(verifyStamp("sid-1", 1, hash, "2026-09-19T11:00:00.000Z", mac, later)).toBeNull();
    expect(verifyStamp("sid-1", 1, hash, at, `${mac}x`, later)).toBeNull();
    expect(verifyStamp("sid-1", 1, hash, 123, mac, later)).toBeNull();
  });

  it("rejects stale and future stamps", () => {
    const { at, mac } = issueStamp("sid-1", 1, hash, now);
    expect(verifyStamp("sid-1", 1, hash, at, mac, now.getTime() + STAMP_MAX_AGE_MS + 1)).toBeNull();
    expect(verifyStamp("sid-1", 1, hash, at, mac, now.getTime() - 60_000)).toBeNull();
  });
});

describe("request guards", () => {
  const req = (headers: Record<string, string>) => new Request("https://4ffnieruchomosci.pl/x", { headers });

  it("accepts only same-origin POSTs", () => {
    expect(isSameOrigin(req({ origin: "https://4ffnieruchomosci.pl", host: "4ffnieruchomosci.pl" }))).toBe(true);
    expect(
      isSameOrigin(
        req({ origin: "https://4ffnieruchomosci.pl", host: "4ffnieruchomosci.pl", "sec-fetch-site": "same-origin" })
      )
    ).toBe(true);
    expect(isSameOrigin(req({ origin: "https://evil.example", host: "4ffnieruchomosci.pl" }))).toBe(false);
    expect(isSameOrigin(req({ host: "4ffnieruchomosci.pl" }))).toBe(false);
    expect(isSameOrigin(req({ origin: "null", host: "4ffnieruchomosci.pl" }))).toBe(false);
    expect(
      isSameOrigin(
        req({ origin: "https://4ffnieruchomosci.pl", host: "4ffnieruchomosci.pl", "sec-fetch-site": "cross-site" })
      )
    ).toBe(false);
  });

  it("rate limits per key within a window", () => {
    const start = 1_000_000;
    for (let i = 0; i < 3; i++) expect(rateLimit("k1", 3, 60_000, start + i).allowed).toBe(true);
    const blocked = rateLimit("k1", 3, 60_000, start + 10);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
    expect(rateLimit("k2", 3, 60_000, start).allowed).toBe(true);
    expect(rateLimit("k1", 3, 60_000, start + 61_000).allowed).toBe(true);
  });
});
