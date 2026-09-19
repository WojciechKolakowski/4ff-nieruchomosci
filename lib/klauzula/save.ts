import { CURRENT_VERSION } from "@/templates/klauzula-rodo";
import type { ChannelId } from "@/templates/klauzula-rodo/2026-09-19/content";
import type { SaveInput, SaveResult } from "./drive";
import { generateKlauzulaPdf } from "./pdf";
import { decodePngDataUrl, prepareSignature, sha256Hex, type PreparedSignature } from "./signature";
import { verifyStamp, type Slot } from "./stamp";
import { normalizeEmail, normalizePersonName, normalizePolishPhone } from "./text";
import { formatWarsaw } from "./time";

/**
 * Everything the "Zatwierdź i zapisz" endpoint does after authentication:
 * validate the payload, verify the server-issued signature stamps, build the
 * PDF from the template and hand it to the archive. Kept separate from the
 * route so the whole flow can be tested with a fake Drive.
 */

export type ProcessSaveResult =
  | { ok: true; folderName: string; fileName: string }
  | { ok: false; status: number; error: string; field?: string };

export type SaveDeps = {
  drive: { saveClauseFile: (input: SaveInput) => Promise<SaveResult> };
  rootFolderId: string;
  now?: () => Date;
};

const CHANNEL_ORDER: ChannelId[] = ["phone", "sms", "email"];
const STALE_SIGNATURE = "Podpis wygasł lub został zmieniony. Złóż podpis ponownie.";

const bad = (error: string, field?: string, status = 400): ProcessSaveResult => ({ ok: false, status, error, field });
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

function readSignature(
  value: unknown,
  slot: Slot,
  sid: string,
  nowMs: number
): { ok: true; image: PreparedSignature; at: Date } | { ok: false; error: string } {
  if (!isRecord(value)) return { ok: false, error: "Brak podpisu." };
  const bytes = decodePngDataUrl(value.image);
  if (!bytes) return { ok: false, error: "Nieprawidłowy plik podpisu." };
  const at = verifyStamp(sid, slot, sha256Hex(bytes), value.at, value.mac, nowMs);
  if (!at) return { ok: false, error: STALE_SIGNATURE };
  const prepared = prepareSignature(bytes);
  return prepared.ok ? { ok: true, image: prepared.value, at } : { ok: false, error: prepared.error };
}

export async function processSave(payload: unknown, sid: string, deps: SaveDeps): Promise<ProcessSaveResult> {
  if (!isRecord(payload)) return bad("Nieprawidłowe dane.");
  const version = CURRENT_VERSION;
  const savedAt = (deps.now ?? (() => new Date()))();

  if (payload.versionId !== version.id) {
    return bad("Wersja klauzuli została zaktualizowana. Odśwież stronę i wypełnij formularz ponownie.", "versionId", 409);
  }

  const name = normalizePersonName(payload.name);
  if (!name.ok) return bad(name.error, "name");
  const email = normalizeEmail(payload.email);
  if (!email.ok) return bad(email.error, "email");

  const signature1 = readSignature(payload.signature1, 1, sid, savedAt.getTime());
  if (!signature1.ok) return bad(signature1.error, "signature1");
  if (signature1.at.getTime() > savedAt.getTime()) return bad(STALE_SIGNATURE, "signature1");

  let consent: Parameters<typeof generateKlauzulaPdf>[0]["consent"] = null;
  if (payload.consent !== null && payload.consent !== undefined) {
    if (!isRecord(payload.consent)) return bad("Nieprawidłowe dane zgody.", "consent");
    const { channels: rawChannels, phone: rawPhone } = payload.consent;

    if (!Array.isArray(rawChannels) || rawChannels.length === 0 || rawChannels.length > CHANNEL_ORDER.length) {
      return bad("Wybierz co najmniej jeden kanał kontaktu.", "channels");
    }
    if (!rawChannels.every((channel) => CHANNEL_ORDER.includes(channel as ChannelId))) {
      return bad("Nieprawidłowy kanał kontaktu.", "channels");
    }
    const channels = CHANNEL_ORDER.filter((channel) => rawChannels.includes(channel));

    const needsPhone = channels.includes("phone") || channels.includes("sms");
    const phoneProvided = typeof rawPhone === "string" && rawPhone.trim() !== "";
    let phone: string | null = null;
    if (needsPhone || phoneProvided) {
      const normalized = normalizePolishPhone(rawPhone);
      if (!normalized.ok) return bad(normalized.error, "phone");
      phone = normalized.value.pretty;
    }

    const signature2 = readSignature(payload.consent.signature2, 2, sid, savedAt.getTime());
    if (!signature2.ok) return bad(signature2.error, "signature2");
    if (signature2.at.getTime() > savedAt.getTime()) return bad(STALE_SIGNATURE, "signature2");

    consent = { channels, phone, signature2: { image: signature2.image, at: signature2.at } };
  }

  const pdf = await generateKlauzulaPdf({
    version,
    name: name.value,
    email: email.value,
    savedAt,
    signature1: { image: signature1.image, at: signature1.at },
    consent,
  });

  // No personal data in the description: only the clause version and yes/no.
  const description = `Wersja klauzuli: ${version.label}. Zgoda marketingowa: ${consent ? "tak" : "nie"}.`;
  const saved = await deps.drive.saveClauseFile({
    rootFolderId: deps.rootFolderId,
    personName: name.value,
    fileStamp: formatWarsaw(savedAt).fileStamp,
    pdf,
    description,
  });
  return { ok: true, folderName: saved.folderName, fileName: saved.fileName };
}
