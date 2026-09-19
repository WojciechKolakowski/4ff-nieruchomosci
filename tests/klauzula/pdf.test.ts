import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import type { TextItem } from "pdfjs-dist/types/src/display/api";
import { CURRENT_VERSION } from "@/templates/klauzula-rodo";
import { generateKlauzulaPdf, type KlauzulaPdfInput } from "@/lib/klauzula/pdf";
import { prepareSignature } from "@/lib/klauzula/signature";
import { makeSignaturePng } from "./helpers";

const version = CURRENT_VERSION;
const sampleDir = process.env.KLAUZULA_SAMPLE_DIR;

function signature(seed: number) {
  const prepared = prepareSignature(makeSignaturePng(1200, 340, seed));
  if (!prepared.ok) throw new Error(prepared.error);
  return prepared.value;
}

const at1 = new Date("2026-09-19T12:32:07Z"); // 14:32:07 in Warsaw (CEST)
const at2 = new Date("2026-09-19T12:33:41Z");

function baseInput(overrides: Partial<KlauzulaPdfInput> = {}): KlauzulaPdfInput {
  return {
    version,
    name: "Zażółć Gęślą-Jaźń O'Brien",
    email: "zazolc.gesla@example.pl",
    savedAt: new Date("2026-09-19T12:34:00Z"),
    signature1: { image: signature(1), at: at1 },
    consent: null,
    ...overrides,
  };
}

type Item = { str: string; x: number; y: number };

async function readPdf(bytes: Uint8Array) {
  const pdf = await getDocument({ data: new Uint8Array(bytes), verbosity: 0 })
    .promise;
  const pages: Item[][] = [];
  for (let no = 1; no <= pdf.numPages; no++) {
    const page = await pdf.getPage(no);
    const content = await page.getTextContent();
    pages.push(
      content.items
        .filter((item): item is TextItem => "str" in item && item.str !== "")
        .map((item) => ({ str: item.str, x: item.transform[4], y: item.transform[5] }))
    );
  }
  return { pdf, pages, meta: await pdf.getMetadata() };
}

const keyOf = (item: Item) => `${item.str}|${item.x.toFixed(1)}|${item.y.toFixed(1)}`;
const pageText = (items: Item[]) => items.map((item) => item.str).join(" ");

function save(name: string, bytes: Uint8Array) {
  if (!sampleDir) return;
  mkdirSync(sampleDir, { recursive: true });
  writeFileSync(path.join(sampleDir, name), bytes);
}

describe("generateKlauzulaPdf", () => {
  it("without marketing consent: 3 pages, annotation on page 3, no marks", async () => {
    const bytes = await generateKlauzulaPdf(baseInput());
    save("bez-zgody.pdf", bytes);
    const { pages, meta } = await readPdf(bytes);

    expect(pages).toHaveLength(3);
    const p2 = pageText(pages[1]);
    expect(p2).toContain("Imię i nazwisko: Zażółć Gęślą-Jaźń O'Brien");
    expect(p2).toContain("E-mail: zazolc.gesla@example.pl");
    expect(p2).toContain("Data i godzina podpisu: 19.09.2026 14:32:07 (Europe/Warsaw)");

    const p3 = pageText(pages[2]);
    expect(p3).toContain("Adnotacja systemowa");
    expect(p3).toContain("Zgody na kontakt marketingowy nie udzielono.");
    expect(p3).toContain("Data i godzina zapisu: 19.09.2026 14:34:00 (Europe/Warsaw)");
    expect(p3).not.toContain("Telefon:");

    const info = meta.info as Record<string, unknown>;
    expect(info.Title).toBe(`${version.pdfTitle} (${version.label})`);
    expect(info.IsAcroFormPresent).toBe(false);
    expect(JSON.stringify(info)).not.toContain("Zażółć");
    expect(JSON.stringify(info)).not.toContain("example.pl");
  });

  it("with consent to all channels: marks, name, phone, second timestamp", async () => {
    const bytes = await generateKlauzulaPdf(
      baseInput({
        consent: {
          channels: ["phone", "sms", "email"],
          phone: "+48 505 644 440",
          signature2: { image: signature(2), at: at2 },
        },
      })
    );
    save("zgoda-wszystkie-kanaly.pdf", bytes);
    const { pages, meta } = await readPdf(bytes);

    expect(pages).toHaveLength(3);
    const p3 = pageText(pages[2]);
    expect(p3).toContain("Zażółć Gęślą-Jaźń O'Brien");
    expect(p3).toContain("Telefon: +48 505 644 440");
    expect(p3).toContain("Data i godzina podpisu: 19.09.2026 14:33:41 (Europe/Warsaw)");
    expect(p3).not.toContain("Adnotacja systemowa");
    expect((meta.info as Record<string, unknown>).IsAcroFormPresent).toBe(false);
  });

  it("consent by e-mail only: no phone line", async () => {
    const bytes = await generateKlauzulaPdf(
      baseInput({
        consent: { channels: ["email"], phone: null, signature2: { image: signature(3), at: at2 } },
      })
    );
    save("zgoda-tylko-email.pdf", bytes);
    const { pages } = await readPdf(bytes);
    expect(pageText(pages[2])).not.toContain("Telefon:");
  });

  it("never alters the template's own text", async () => {
    const template = new Uint8Array(
      readFileSync(path.join(process.cwd(), "templates/klauzula-rodo", version.id, version.templateFile))
    );
    const { pages: templatePages } = await readPdf(template);
    const output = await generateKlauzulaPdf(
      baseInput({
        consent: {
          channels: ["phone", "sms", "email"],
          phone: "+48 505 644 440",
          signature2: { image: signature(2), at: at2 },
        },
      })
    );
    const { pages: outputPages } = await readPdf(output);

    templatePages.forEach((items, index) => {
      const present = new Map<string, number>();
      for (const item of outputPages[index]) present.set(keyOf(item), (present.get(keyOf(item)) ?? 0) + 1);
      for (const item of items) {
        const count = present.get(keyOf(item)) ?? 0;
        expect(count, `missing on page ${index + 1}: ${item.str}`).toBeGreaterThan(0);
        present.set(keyOf(item), count - 1);
      }
    });
  });

  it("handles the longest allowed name and e-mail without throwing", async () => {
    const longName = "Wielosłowna-Przedłużona ".repeat(4).trim().slice(0, 100);
    const longEmail = `${"a".repeat(60)}@${"b".repeat(20)}.example.pl`.slice(0, 90);
    const bytes = await generateKlauzulaPdf(
      baseInput({
        name: longName,
        email: longEmail,
        consent: {
          channels: ["sms"],
          phone: "+48 600 700 800",
          signature2: { image: signature(4), at: at2 },
        },
      })
    );
    save("dlugie-dane.pdf", bytes);
    const { pages } = await readPdf(bytes);
    expect(pages).toHaveLength(3);
    expect(pageText(pages[1])).toContain("Wielosłowna-Przedłużona");
  });
});
