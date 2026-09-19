import { getSession } from "@/lib/klauzula/auth";
import { isSameOrigin, json, rateLimit, readJson } from "@/lib/klauzula/guard";
import { issueStamp } from "@/lib/klauzula/stamp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Issues the server-side timestamp for one signature (see lib/klauzula/stamp.ts). */
export async function POST(request: Request) {
  if (!isSameOrigin(request)) return json({ error: "Niedozwolone żądanie." }, 403);

  const session = await getSession();
  if (!session) return json({ error: "Sesja wygasła. Zaloguj się ponownie." }, 401);

  if (!rateLimit(`stamp:${session.sid}`, 60, 10 * 60_000).allowed) {
    return json({ error: "Zbyt wiele żądań. Spróbuj ponownie za chwilę." }, 429);
  }

  const body = await readJson(request, 1_000);
  if (!body.ok) return body.response;
  const { slot, hash } = (body.data ?? {}) as { slot?: unknown; hash?: unknown };
  if ((slot !== 1 && slot !== 2) || typeof hash !== "string" || !/^[0-9a-f]{64}$/.test(hash)) {
    return json({ error: "Nieprawidłowe dane." }, 400);
  }

  return json(issueStamp(session.sid, slot, hash));
}
