import { SESSION_COOKIE, sessionCookieOptions } from "@/lib/klauzula/auth";
import { isSameOrigin, json } from "@/lib/klauzula/guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return json({ error: "Niedozwolone żądanie." }, 403);
  const response = json({ ok: true });
  response.cookies.set({ name: SESSION_COOKIE, value: "", maxAge: 0, ...sessionCookieOptions });
  return response;
}
