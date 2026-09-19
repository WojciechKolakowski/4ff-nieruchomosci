import { hmac, safeEqual } from "./auth";

/**
 * Server-issued timestamp for one signature ("stamp").
 *
 * The client asks for a stamp when a signature is confirmed, sending only the
 * SHA-256 of the PNG. The server answers with the current time and an HMAC
 * binding (session, slot, image hash, time). When the form is saved the server
 * recomputes the hash from the received PNG and checks the HMAC, so the time
 * printed in the PDF is the server's — the browser cannot choose or edit it —
 * and the stamp cannot be moved to a different image. Nothing is stored.
 */

export type Slot = 1 | 2;
export const STAMP_MAX_AGE_MS = 3 * 60 * 60 * 1000;
const CLOCK_SKEW_MS = 5_000;

function macFor(sid: string, slot: Slot, hash: string, atIso: string): string {
  return hmac("stamp", `v1|${sid}|${slot}|${hash}|${atIso}`);
}

export function issueStamp(sid: string, slot: Slot, hash: string, now = new Date()) {
  const at = now.toISOString();
  return { at, mac: macFor(sid, slot, hash, at) };
}

/** Returns the stamped time if genuine and fresh, otherwise null. */
export function verifyStamp(
  sid: string,
  slot: Slot,
  hash: string,
  atIso: unknown,
  mac: unknown,
  nowMs = Date.now()
): Date | null {
  if (typeof atIso !== "string" || typeof mac !== "string") return null;
  const at = new Date(atIso);
  if (Number.isNaN(at.getTime()) || at.toISOString() !== atIso) return null;
  if (!safeEqual(mac, macFor(sid, slot, hash, atIso))) return null;
  const age = nowMs - at.getTime();
  return age >= -CLOCK_SKEW_MS && age <= STAMP_MAX_AGE_MS ? at : null;
}
