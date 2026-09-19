import { getSession } from "@/lib/klauzula/auth";
import { DriveError, getDriveClient, resolveRootFolderId } from "@/lib/klauzula/drive";
import { isSameOrigin, json, rateLimit, readJson } from "@/lib/klauzula/guard";
import { processSave } from "@/lib/klauzula/save";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

// Two signature PNGs (≤ 400 kB each, base64) plus a few short fields.
const MAX_BODY_BYTES = 1_300_000;

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return json({ error: "Niedozwolone żądanie." }, 403);

  const session = await getSession();
  if (!session) return json({ error: "Sesja wygasła. Zaloguj się ponownie." }, 401);

  if (!rateLimit(`save:${session.sid}`, 30, 10 * 60_000).allowed) {
    return json({ error: "Zbyt wiele zapisów w krótkim czasie. Spróbuj ponownie za chwilę." }, 429);
  }

  const body = await readJson(request, MAX_BODY_BYTES);
  if (!body.ok) return body.response;

  try {
    const result = await processSave(body.data, session.sid, {
      drive: getDriveClient(),
      rootFolderId: resolveRootFolderId(),
    });
    if (!result.ok) return json({ error: result.error, field: result.field }, result.status);
    return json({ ok: true, folderName: result.folderName, fileName: result.fileName });
  } catch (error) {
    // Never log client data, signatures or PDFs — only the error class/status.
    if (error instanceof DriveError) {
      console.error("klauzula-rodo: Drive save failed", { status: error.status, message: error.message });
      return json(
        { error: "Nie udało się zapisać dokumentu na Dysku Google. Dane w formularzu zostały zachowane – spróbuj ponownie." },
        502
      );
    }
    console.error("klauzula-rodo: save failed", { name: error instanceof Error ? error.name : "unknown" });
    return json({ error: "Wystąpił błąd serwera. Dane w formularzu zostały zachowane – spróbuj ponownie." }, 500);
  }
}
