// Validation and sanitisation of the free-text fields entered by the client.
// Pure functions — shared by the API route and unit tests.

export type Result<T> = { ok: true; value: T } | { ok: false; error: string };

export const MAX_NAME_LENGTH = 100;
/** Longer addresses would not fit on the PDF annotation line. */
export const MAX_EMAIL_LENGTH = 90;

/** NFC, control/zero-width characters removed, whitespace collapsed, trimmed. */
export function cleanText(input: string): string {
  return input
    .normalize("NFC")
    .replace(/[\p{Cc}​-‍⁠﻿]/gu, "")
    .replace(/\s+/gu, " ")
    .trim();
}

// Latin letters only (the PDF font covers Latin scripts), optional trailing
// dot per word ("J. Kowalski", "Kowalski jr."), words joined by space,
// hyphen or apostrophe ("Anna-Maria", "O'Brien").
const NAME_PATTERN = /^\p{Script=Latin}+\.?(?:[ \-'’]\p{Script=Latin}+\.?)*$/u;

export function normalizePersonName(input: unknown): Result<string> {
  if (typeof input !== "string") return { ok: false, error: "Podaj imię i nazwisko." };
  const value = cleanText(input);
  if (!value) return { ok: false, error: "Podaj imię i nazwisko." };
  if (value.length > MAX_NAME_LENGTH) {
    return { ok: false, error: `Imię i nazwisko może mieć maksymalnie ${MAX_NAME_LENGTH} znaków.` };
  }
  if (!NAME_PATTERN.test(value)) {
    return {
      ok: false,
      error: "Imię i nazwisko może zawierać tylko litery, spacje, myślniki, apostrofy i kropki.",
    };
  }
  if (!value.includes(" ")) return { ok: false, error: "Podaj imię i nazwisko (oba człony)." };
  return { ok: true, value };
}

const EMAIL_PATTERN = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:".]{2,}$/u;

export function normalizeEmail(input: unknown): Result<string> {
  if (typeof input !== "string") return { ok: false, error: "Podaj adres e-mail." };
  const value = cleanText(input);
  if (!value) return { ok: false, error: "Podaj adres e-mail." };
  if (value.length > MAX_EMAIL_LENGTH) {
    return { ok: false, error: `Adres e-mail może mieć maksymalnie ${MAX_EMAIL_LENGTH} znaków.` };
  }
  const [local = "", domain = ""] = value.split("@");
  if (
    !EMAIL_PATTERN.test(value) ||
    value.includes("..") ||
    local.length > 64 ||
    local.startsWith(".") ||
    local.endsWith(".") ||
    domain.startsWith(".") ||
    domain.startsWith("-")
  ) {
    return { ok: false, error: "Podaj poprawny adres e-mail." };
  }
  return { ok: true, value };
}

/**
 * Accepts +48 / 0048 / 48 prefixes, spaces, dashes, dots and brackets; the
 * national number must be 9 digits not starting with 0. Returns the compact
 * form "+48123456789" and a display form "+48 123 456 789".
 */
export function normalizePolishPhone(
  input: unknown
): Result<{ e164: string; pretty: string }> {
  const invalid: Result<never> = {
    ok: false,
    error: "Podaj polski numer telefonu (9 cyfr, np. 505 644 440 lub +48 505 644 440).",
  };
  if (typeof input !== "string") return invalid;
  let digits = input.replace(/[\s\-().]/g, "");
  if (digits.startsWith("+")) {
    if (!digits.startsWith("+48")) return invalid;
    digits = digits.slice(3);
  } else if (digits.startsWith("0048")) {
    digits = digits.slice(4);
  } else if (/^48\d{9}$/.test(digits)) {
    digits = digits.slice(2);
  }
  if (!/^[1-9]\d{8}$/.test(digits) || /^(\d)\1{8}$/.test(digits)) return invalid;
  return {
    ok: true,
    value: {
      e164: `+48${digits}`,
      pretty: `+48 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`,
    },
  };
}

/**
 * Makes a string safe to use as a Google Drive file/folder name. Keeps Polish
 * characters and apostrophes (O'Brien); replaces characters that are unsafe
 * in file names and trims to a maximum length.
 */
export function sanitizeDriveName(input: string, maxLength = 100): string {
  return cleanText(input)
    .replace(/[\\/:*?"<>|]/g, " ")
    .replace(/\s+/gu, " ")
    .replace(/^\.+/, "")
    .slice(0, maxLength)
    .trim();
}

/** Escapes a value for use inside single quotes of a Drive `q` query. */
export function escapeDriveQuery(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}
