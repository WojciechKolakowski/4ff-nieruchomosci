import { describe, expect, it } from "vitest";
import {
  escapeDriveQuery,
  normalizeEmail,
  normalizePersonName,
  normalizePolishPhone,
  sanitizeDriveName,
} from "@/lib/klauzula/text";
import { formatWarsaw } from "@/lib/klauzula/time";
import { decodePngDataUrl, prepareSignature, sha256Hex } from "@/lib/klauzula/signature";
import { makeBlankPng, makeSignaturePng } from "./helpers";

describe("normalizePersonName", () => {
  it.each([
    ["Jan Kowalski", "Jan Kowalski"],
    ["  Zażółć   Gęślą-Jaźń  ", "Zażółć Gęślą-Jaźń"],
    ["Patrick O'Brien", "Patrick O'Brien"],
    ["Anna O’Neil-Nowak", "Anna O’Neil-Nowak"],
    ["J. Kowalski", "J. Kowalski"],
    ["Jan Kowalski jr.", "Jan Kowalski jr."],
  ])("accepts %j", (input, expected) => {
    expect(normalizePersonName(input)).toEqual({ ok: true, value: expected });
  });

  it("normalises decomposed diacritics to NFC", () => {
    const decomposed = "Zóła Kępa"; // ó, ę written as base + combining mark
    const result = normalizePersonName(decomposed);
    expect(result).toEqual({ ok: true, value: "Zóła Kępa".normalize("NFC") });
  });

  it.each([
    ["Jan", "oba człony"],
    ["", "Podaj"],
    ["Jan 3 Kowalski", "tylko litery"],
    ["Иван Петров", "tylko litery"],
    ["Jan <b>Kowalski</b>", "tylko litery"],
    ["a".repeat(101) + " b", "maksymalnie"],
  ])("rejects %j", (input, messagePart) => {
    const result = normalizePersonName(input);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain(messagePart);
  });

  it("rejects non-strings", () => {
    expect(normalizePersonName(undefined).ok).toBe(false);
    expect(normalizePersonName(42).ok).toBe(false);
  });
});

describe("normalizeEmail", () => {
  it.each(["jan@example.pl", "jan.kowalski+rodo@sub.example.com", " JAN@Example.PL "])(
    "accepts %j",
    (input) => expect(normalizeEmail(input).ok).toBe(true)
  );

  it.each(["", "jan", "jan@", "@example.pl", "jan@example", "jan@@example.pl", "ja n@example.pl", "jan..k@example.pl", ".jan@example.pl", `${"a".repeat(80)}@example.pl`])(
    "rejects %j",
    (input) => expect(normalizeEmail(input).ok).toBe(false)
  );
});

describe("normalizePolishPhone", () => {
  it.each([
    ["505644440", "+48505644440", "+48 505 644 440"],
    ["505 644 440", "+48505644440", "+48 505 644 440"],
    ["+48 505-644-440", "+48505644440", "+48 505 644 440"],
    ["0048505644440", "+48505644440", "+48 505 644 440"],
    ["48505644440", "+48505644440", "+48 505 644 440"],
    ["(+48) 505.644.440", "+48505644440", "+48 505 644 440"],
    ["+48 22 123 45 67", "+48221234567", "+48 221 234 567"],
  ])("accepts %j", (input, e164, pretty) => {
    expect(normalizePolishPhone(input)).toEqual({ ok: true, value: { e164, pretty } });
  });

  it.each(["", "12345", "0505644440", "+49 505 644 440", "+1 415 555 0100", "+48 05 644 440", "111111111", "abc505644440", "5056444401"])(
    "rejects %j",
    (input) => expect(normalizePolishPhone(input).ok).toBe(false)
  );
});

describe("Drive name helpers", () => {
  it("keeps Polish letters and apostrophes but drops path-unsafe characters", () => {
    expect(sanitizeDriveName("  Zażółć  O'Brien ")).toBe("Zażółć O'Brien");
    expect(sanitizeDriveName('Jan/Ko\\wal:ski*?"<>|')).toBe("Jan Ko wal ski");
    expect(sanitizeDriveName("..hidden")).toBe("hidden");
  });

  it("limits length", () => {
    expect(sanitizeDriveName("a".repeat(300), 50)).toHaveLength(50);
  });

  it("escapes quotes and backslashes for Drive queries", () => {
    expect(escapeDriveQuery("O'Brien")).toBe("O\\'Brien");
    expect(escapeDriveQuery("a\\b")).toBe("a\\\\b");
    expect(escapeDriveQuery("x' or name contains '")).toBe("x\\' or name contains \\'");
  });
});

describe("formatWarsaw", () => {
  it("uses CEST (UTC+2) in summer", () => {
    const t = formatWarsaw(new Date("2026-09-19T12:32:07Z"));
    expect(t.dateTime).toBe("19.09.2026 14:32:07");
    expect(t.dateTimeWithZone).toBe("19.09.2026 14:32:07 (Europe/Warsaw)");
    expect(t.fileStamp).toBe("2026-09-19_1432");
  });

  it("uses CET (UTC+1) in winter and rolls the date over midnight", () => {
    const t = formatWarsaw(new Date("2026-01-15T23:30:00Z"));
    expect(t.dateTime).toBe("16.01.2026 00:30:00");
    expect(t.fileStamp).toBe("2026-01-16_0030");
  });
});

describe("signatures", () => {
  it("decodes only well-formed PNG data URLs", () => {
    const png = makeSignaturePng();
    const url = `data:image/png;base64,${png.toString("base64")}`;
    expect(decodePngDataUrl(url)?.equals(png)).toBe(true);
    expect(decodePngDataUrl("data:image/jpeg;base64,AAAA")).toBeNull();
    expect(decodePngDataUrl("nope")).toBeNull();
    expect(decodePngDataUrl(`data:image/png;base64,${"A".repeat(2_000_000)}`)).toBeNull();
    expect(decodePngDataUrl("data:image/png;base64,@@@")).toBeNull();
    expect(decodePngDataUrl(123)).toBeNull();
  });

  it("crops to the ink and keeps a valid PNG", () => {
    const result = prepareSignature(makeSignaturePng(1200, 340, 1));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.width).toBeLessThanOrEqual(1200);
      expect(result.value.height).toBeLessThanOrEqual(340);
      expect(result.value.png.subarray(1, 4).toString()).toBe("PNG");
    }
  });

  it("rejects empty, non-PNG and oversized input", () => {
    expect(prepareSignature(makeBlankPng()).ok).toBe(false);
    expect(prepareSignature(Buffer.from("not a png at all")).ok).toBe(false);
    expect(prepareSignature(Buffer.alloc(500_000, 1)).ok).toBe(false);
  });

  it("hashes deterministically", () => {
    expect(sha256Hex("abc")).toBe(
      "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"
    );
  });
});
