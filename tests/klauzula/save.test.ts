import { beforeAll, describe, expect, it, vi } from "vitest";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import type { TextItem } from "pdfjs-dist/types/src/display/api";
import { CURRENT_VERSION } from "@/templates/klauzula-rodo";
import { processSave } from "@/lib/klauzula/save";
import { sha256Hex } from "@/lib/klauzula/signature";
import { issueStamp, type Slot } from "@/lib/klauzula/stamp";
import type { SaveInput } from "@/lib/klauzula/drive";
import { makeSignaturePng } from "./helpers";

const SID = "session-1";
const NOW = new Date("2026-09-19T12:40:00Z"); // 14:40 in Warsaw
const STAMP_TIME = new Date("2026-09-19T12:35:00Z");

beforeAll(() => {
  process.env.KLAUZULA_SESSION_SECRET = "test-secret-".padEnd(48, "x");
});

/** A signature exactly as the browser sends it: PNG data URL + server stamp. */
function signed(slot: Slot, seed: number, sid = SID, at = STAMP_TIME) {
  const png = makeSignaturePng(1200, 340, seed);
  const stamp = issueStamp(sid, slot, sha256Hex(png), at);
  return { image: `data:image/png;base64,${png.toString("base64")}`, ...stamp };
}

function setup() {
  const saved: SaveInput[] = [];
  const drive = {
    saveClauseFile: vi.fn(async (input: SaveInput) => {
      saved.push(input);
      return { folderId: "f1", folderName: "Jan Kowalski", fileId: "x1", fileName: "plik.pdf" };
    }),
  };
  const run = (payload: unknown, sid = SID) =>
    processSave(payload, sid, { drive, rootFolderId: "root", now: () => NOW });
  return { drive, saved, run };
}

const valid = () => ({
  versionId: CURRENT_VERSION.id,
  name: "Jan Kowalski",
  email: "jan@example.pl",
  signature1: signed(1, 1),
  consent: null as unknown,
});

async function pdfText(bytes: Uint8Array) {
  const pdf = await getDocument({ data: new Uint8Array(bytes), verbosity: 0 }).promise;
  const out: string[] = [];
  for (let n = 1; n <= pdf.numPages; n++) {
    const content = await (await pdf.getPage(n)).getTextContent();
    out.push(
      content.items
        .filter((i): i is TextItem => "str" in i)
        .map((i) => i.str)
        .join(" ")
    );
  }
  return out;
}

describe("processSave — happy paths", () => {
  it("acknowledgement only (no marketing consent)", async () => {
    const { run, saved } = setup();
    const result = await run(valid());

    expect(result).toEqual({ ok: true, folderName: "Jan Kowalski", fileName: "plik.pdf" });
    expect(saved).toHaveLength(1);
    expect(saved[0].rootFolderId).toBe("root");
    expect(saved[0].personName).toBe("Jan Kowalski");
    expect(saved[0].fileStamp).toBe("2026-09-19_1440");
    expect(saved[0].description).toBe("Wersja klauzuli: wersja z 19.09.2026. Zgoda marketingowa: nie.");

    expect(Buffer.from(saved[0].pdf.subarray(0, 5)).toString()).toBe("%PDF-");
    const pages = await pdfText(saved[0].pdf);
    expect(pages).toHaveLength(3);
    expect(pages[1]).toContain("Data i godzina podpisu: 19.09.2026 14:35:00 (Europe/Warsaw)");
    expect(pages[2]).toContain("Zgody na kontakt marketingowy nie udzielono.");
  });

  it("acknowledgement plus consent on all channels", async () => {
    const { run, saved } = setup();
    const result = await run({
      ...valid(),
      consent: { channels: ["email", "phone", "sms"], phone: "505 644 440", signature2: signed(2, 2) },
    });

    expect(result.ok).toBe(true);
    expect(saved[0].description).toBe("Wersja klauzuli: wersja z 19.09.2026. Zgoda marketingowa: tak.");
    const pages = await pdfText(saved[0].pdf);
    expect(pages[2]).toContain("Telefon: +48 505 644 440");
    expect(pages[2]).not.toContain("Adnotacja systemowa");
  });

  it("e-mail-only consent does not require a phone number", async () => {
    const { run } = setup();
    const result = await run({ ...valid(), consent: { channels: ["email"], signature2: signed(2, 2) } });
    expect(result.ok).toBe(true);
  });

  it("keeps the description free of personal data", async () => {
    const { run, saved } = setup();
    await run({ ...valid(), name: "Zażółć Gęślą", email: "tajny@example.pl" });
    expect(saved[0].description).not.toMatch(/Zażółć|Gęślą|tajny|example/);
  });
});

describe("processSave — rejections", () => {
  it.each([
    ["not an object", "hello"],
    ["array", []],
    ["null", null],
  ])("rejects a payload that is %s", async (_label, payload) => {
    const { run, drive } = setup();
    expect((await run(payload)).ok).toBe(false);
    expect(drive.saveClauseFile).not.toHaveBeenCalled();
  });

  it("rejects an outdated clause version with 409", async () => {
    const { run } = setup();
    expect(await run({ ...valid(), versionId: "2020-01-01" })).toMatchObject({ ok: false, status: 409 });
  });

  it("validates name and e-mail", async () => {
    const { run } = setup();
    expect(await run({ ...valid(), name: "Jan" })).toMatchObject({ ok: false, field: "name" });
    expect(await run({ ...valid(), email: "nie-email" })).toMatchObject({ ok: false, field: "email" });
  });

  it("requires a phone number for phone and SMS consent, and validates one if given", async () => {
    const { run } = setup();
    for (const channels of [["phone"], ["sms"], ["phone", "email"]]) {
      expect(await run({ ...valid(), consent: { channels, signature2: signed(2, 2) } })).toMatchObject({
        ok: false,
        field: "phone",
      });
    }
    expect(
      await run({ ...valid(), consent: { channels: ["email"], phone: "12", signature2: signed(2, 2) } })
    ).toMatchObject({ ok: false, field: "phone" });
  });

  it("rejects empty or unknown channel lists", async () => {
    const { run } = setup();
    for (const channels of [[], ["fax"], "email", undefined]) {
      expect(await run({ ...valid(), consent: { channels, signature2: signed(2, 2) } })).toMatchObject({
        ok: false,
        field: "channels",
      });
    }
  });

  it("rejects consent without a (valid) second signature", async () => {
    const { run } = setup();
    expect(await run({ ...valid(), consent: { channels: ["email"] } })).toMatchObject({ ok: false, field: "signature2" });
  });

  it("does not trust client-made stamps", async () => {
    const { run, drive } = setup();
    const genuine = signed(1, 1);

    // forged MAC
    expect(await run({ ...valid(), signature1: { ...genuine, mac: `${genuine.mac.slice(0, -3)}AAA` } })).toMatchObject({
      ok: false,
      field: "signature1",
    });
    // stamp moved to a different image
    const other = signed(1, 99);
    expect(await run({ ...valid(), signature1: { ...genuine, image: other.image } })).toMatchObject({
      ok: false,
      field: "signature1",
    });
    // client edits the time
    expect(await run({ ...valid(), signature1: { ...genuine, at: "2026-01-01T00:00:00.000Z" } })).toMatchObject({
      ok: false,
      field: "signature1",
    });
    // stamp issued for another session / for the other slot
    expect((await run({ ...valid(), signature1: signed(1, 1, "someone-else") })).ok).toBe(false);
    expect((await run({ ...valid(), signature1: signed(2, 1) })).ok).toBe(false);
    // stamp from the future
    expect((await run({ ...valid(), signature1: signed(1, 1, SID, new Date("2026-09-19T13:00:00Z")) })).ok).toBe(false);
    // stale stamp (older than 3 h)
    expect((await run({ ...valid(), signature1: signed(1, 1, SID, new Date("2026-09-19T08:00:00Z")) })).ok).toBe(false);

    expect(drive.saveClauseFile).not.toHaveBeenCalled();
  });

  it("rejects a blank signature even with a genuine stamp", async () => {
    const { run } = setup();
    const { makeBlankPng } = await import("./helpers");
    const png = makeBlankPng();
    const stamp = issueStamp(SID, 1, sha256Hex(png), STAMP_TIME);
    const result = await run({
      ...valid(),
      signature1: { image: `data:image/png;base64,${png.toString("base64")}`, ...stamp },
    });
    expect(result).toMatchObject({ ok: false, field: "signature1" });
  });

  it("propagates archive failures so the route can report them", async () => {
    const drive = { saveClauseFile: vi.fn(async () => Promise.reject(new Error("drive down"))) };
    await expect(processSave(valid(), SID, { drive, rootFolderId: "root", now: () => NOW })).rejects.toThrow("drive down");
  });
});
