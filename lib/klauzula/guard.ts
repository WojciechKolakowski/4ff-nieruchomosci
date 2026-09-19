import { NextResponse } from "next/server";

// Small helpers shared by the /api/klauzula-rodo/* route handlers.

export function json(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store, max-age=0", ...headers },
  });
}

/**
 * CSRF defence in depth (the session cookie is also SameSite=Strict):
 * a state-changing request must come from this very site.
 */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) return false;
  try {
    if (new URL(origin).host !== host) return false;
  } catch {
    return false;
  }
  const fetchSite = request.headers.get("sec-fetch-site");
  return !fetchSite || fetchSite === "same-origin";
}

/** Reads a JSON body with a hard size limit (before and after decoding). */
export async function readJson(
  request: Request,
  maxBytes: number
): Promise<{ ok: true; data: unknown } | { ok: false; response: NextResponse }> {
  const bad = (message: string, status = 400) => ({
    ok: false as const,
    response: json({ error: message }, status),
  });
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return bad("Nieprawidłowe żądanie.", 415);
  }
  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > maxBytes) return bad("Przesłane dane są zbyt duże.", 413);
  const text = await request.text();
  if (Buffer.byteLength(text) > maxBytes) return bad("Przesłane dane są zbyt duże.", 413);
  try {
    return { ok: true, data: JSON.parse(text) };
  } catch {
    return bad("Nieprawidłowe dane.");
  }
}

export function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "unknown";
}

// ── Best-effort in-memory rate limit ────────────────────────────────────
// Serverless instances do not share memory, so this only slows down naive
// abuse. The real limit is a Vercel Firewall rate-limit rule on
// /api/klauzula-rodo/* (see README-klauzula-rodo.md).

const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, max: number, windowMs: number, now = Date.now()) {
  if (buckets.size > 5000) {
    for (const [bucketKey, bucket] of buckets) if (bucket.resetAt <= now) buckets.delete(bucketKey);
  }
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }
  bucket.count++;
  return {
    allowed: bucket.count <= max,
    retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
  };
}

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
