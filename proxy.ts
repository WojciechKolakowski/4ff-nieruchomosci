import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Nonce-based Content-Security-Policy for the internal /klauzula-rodo page
 * only (the public site is untouched). Next.js reads the nonce from the
 * request's CSP header and applies it to its own scripts and styles; the page
 * is dynamic (it reads the session cookie), so a fresh nonce is possible on
 * every request.
 */
export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isDev = process.env.NODE_ENV === "development";

  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    // Inline style="" attributes (React style props) need -attr below; <style>
    // and <link> stay nonce/self only. In dev the tooling injects un-nonced
    // <style> tags, so the nonce is dropped there ('unsafe-inline' is ignored
    // whenever a nonce is present).
    isDev ? "style-src 'self' 'unsafe-inline'" : `style-src 'self' 'nonce-${nonce}'`,
    "style-src-attr 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(isDev ? [] : ["upgrade-insecure-requests"]),
  ].join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  matcher: [
    {
      source: "/klauzula-rodo/:path*",
      // Skip prefetches: they get no nonce and are never used for the real render.
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
