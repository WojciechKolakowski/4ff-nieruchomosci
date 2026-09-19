import type { NextConfig } from "next";

// Internal client-clause page (see README-klauzula-rodo.md): never indexed,
// never cached, no referrer, not framable. The nonce-based CSP for the page
// itself is set per request in proxy.ts.
const internalHeaders = [
  { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive, nosnippet" },
  { key: "Cache-Control", value: "no-store, max-age=0" },
  { key: "Referrer-Policy", value: "no-referrer" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  async headers() {
    return [
      { source: "/klauzula-rodo/:path*", headers: internalHeaders },
      { source: "/api/klauzula-rodo/:path*", headers: internalHeaders },
    ];
  },
  // The save endpoint reads the PDF template and fonts from disk at runtime;
  // tell the serverless bundler to ship them with it.
  outputFileTracingIncludes: {
    "/api/klauzula-rodo/save": ["./templates/klauzula-rodo/**/*"],
  },
};

export default nextConfig;
