import { readFile } from "node:fs/promises";
import path from "node:path";
import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import type { ClauseVersion } from "@/templates/klauzula-rodo";
import type { ChannelId } from "@/templates/klauzula-rodo/2026-09-19/content";
import type { Box } from "@/templates/klauzula-rodo/2026-09-19/coords";
import type { PreparedSignature } from "./signature";
import { formatWarsaw } from "./time";

/**
 * Builds the archive PDF by loading the approved template and drawing ONLY
 * additions on top of it (text, signature images, X marks). The template's
 * own content is never re-typeset. No AcroForm fields are created.
 */

export type KlauzulaPdfInput = {
  version: ClauseVersion;
  name: string;
  email: string;
  /** Moment of saving (used when there is no signature 2 to timestamp). */
  savedAt: Date;
  signature1: { image: PreparedSignature; at: Date };
  consent: null | {
    channels: ChannelId[];
    /** Display form, e.g. "+48 505 644 440". Null when only e-mail was chosen. */
    phone: string | null;
    signature2: { image: PreparedSignature; at: Date };
  };
};

const TEMPLATES_ROOT = path.join(process.cwd(), "templates", "klauzula-rodo");
const INK = rgb(0.07, 0.07, 0.07);
const GRAY = rgb(0.33, 0.33, 0.33);
const RULE = rgb(0.733, 0.733, 0.733);

let fontBytes: Promise<{ regular: Buffer; bold: Buffer }> | undefined;
function loadFontBytes() {
  fontBytes ??= Promise.all([
    readFile(path.join(TEMPLATES_ROOT, "fonts", "Lato-Regular.ttf")),
    readFile(path.join(TEMPLATES_ROOT, "fonts", "Lato-Bold.ttf")),
  ]).then(([regular, bold]) => ({ regular, bold }));
  return fontBytes;
}

type Fonts = { regular: PDFFont; bold: PDFFont };

/** Replaces characters the font cannot draw (never expected: input is validated). */
function drawable(font: PDFFont, text: string): string {
  const supported = new Set(font.getCharacterSet());
  return Array.from(text)
    .map((char) => (supported.has(char.codePointAt(0)!) || /\s/.test(char) ? char : "?"))
    .join("");
}

function wrapWords(font: PDFFont, text: string, size: number, maxWidth: number): string[] {
  const lines: string[] = [];
  let current = "";
  const push = (word: string) => {
    const candidate = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
      current = candidate;
      return;
    }
    if (current) lines.push(current);
    current = "";
    if (font.widthOfTextAtSize(word, size) <= maxWidth) {
      current = word;
      return;
    }
    // A single word wider than the field: break it by characters.
    for (const char of Array.from(word)) {
      if (current && font.widthOfTextAtSize(current + char, size) > maxWidth) {
        lines.push(current);
        current = "";
      }
      current += char;
    }
  };
  text.split(" ").filter(Boolean).forEach(push);
  if (current) lines.push(current);
  return lines;
}

type Layout = { size: number; lines: string[] };

/**
 * Picks the largest font size (from `sizes`, descending) at which the text
 * fits in `maxLines` lines of `maxWidth`. If nothing fits even at the smallest
 * size, the last line is ellipsised (inputs are length-limited so this is a
 * safety net, not an expected path).
 */
function layoutText(
  font: PDFFont,
  raw: string,
  maxWidth: number,
  sizes: number[],
  maxLines: number
): Layout {
  const text = drawable(font, raw);
  for (const size of sizes) {
    const lines = wrapWords(font, text, size, maxWidth);
    if (lines.length <= maxLines) return { size, lines };
  }
  const size = sizes[sizes.length - 1];
  const lines = wrapWords(font, text, size, maxWidth).slice(0, maxLines);
  let last = lines[maxLines - 1] ?? "";
  while (last.length > 1 && font.widthOfTextAtSize(`${last}…`, size) > maxWidth) last = last.slice(0, -1);
  lines[maxLines - 1] = `${last}…`;
  return { size, lines };
}

const range = (from: number, to: number, step: number) => {
  const out: number[] = [];
  for (let value = from; value >= to - 1e-9; value -= step) out.push(value);
  return out;
};

type Line = { text: string; size: number; bold?: boolean; color?: ReturnType<typeof rgb> };

function drawLines(
  page: PDFPage,
  fonts: Fonts,
  x: number,
  firstBaseline: number,
  lineHeight: number,
  lines: Line[]
) {
  lines.forEach((line, index) => {
    page.drawText(line.text, {
      x,
      y: firstBaseline - index * lineHeight,
      size: line.size,
      font: line.bold ? fonts.bold : fonts.regular,
      color: line.color ?? INK,
    });
  });
}

async function drawSignature(doc: PDFDocument, page: PDFPage, box: Box, signature: PreparedSignature, maxScale: number) {
  const image = await doc.embedPng(signature.png);
  const scale = Math.min(box.w / image.width, box.h / image.height, maxScale);
  const width = image.width * scale;
  const height = image.height * scale;
  page.drawImage(image, { x: box.x + (box.w - width) / 2, y: box.y, width, height });
}

function drawCross(page: PDFPage, box: { x: number; y: number; size: number }) {
  const margin = 1.8;
  const options = { thickness: 1.15, color: INK };
  page.drawLine({
    start: { x: box.x + margin, y: box.y + margin },
    end: { x: box.x + box.size - margin, y: box.y + box.size - margin },
    ...options,
  });
  page.drawLine({
    start: { x: box.x + margin, y: box.y + box.size - margin },
    end: { x: box.x + box.size - margin, y: box.y + margin },
    ...options,
  });
}

const HEADER: Omit<Line, "text"> = { size: 7.5, bold: true, color: GRAY };
const FIELD_SIZES = range(8.5, 6, 0.5);

export async function generateKlauzulaPdf(input: KlauzulaPdfInput): Promise<Uint8Array> {
  const { version, name, email, savedAt, signature1, consent } = input;
  const { coords } = version;

  const templateBytes = await readFile(path.join(TEMPLATES_ROOT, version.id, version.templateFile));
  const doc = await PDFDocument.load(templateBytes);
  if (doc.getPageCount() !== 3) throw new Error("Template must have exactly 3 pages.");

  doc.registerFontkit(fontkit);
  const bytes = await loadFontBytes();
  const fonts: Fonts = {
    regular: await doc.embedFont(bytes.regular, { subset: true }),
    bold: await doc.embedFont(bytes.bold, { subset: true }),
  };
  const [, page2, page3] = doc.getPages();

  // ── Page 2: acknowledgement signature + electronic data block ──────────
  const block2 = coords.page2.dataBlock;
  await drawSignature(doc, page2, coords.page2.signature, signature1.image, coords.maxSignatureScale);

  const nameLayout = layoutText(fonts.regular, `Imię i nazwisko: ${name}`, block2.maxWidth, FIELD_SIZES, 2);
  const emailLayout = layoutText(fonts.regular, `E-mail: ${email}`, block2.maxWidth, FIELD_SIZES, 1);
  const lines2: Line[] = [
    { text: "Dane wpisane elektronicznie", ...HEADER },
    ...nameLayout.lines.map((text) => ({ text, size: nameLayout.size })),
    ...emailLayout.lines.map((text) => ({ text, size: emailLayout.size })),
    { text: `Data i godzina podpisu: ${formatWarsaw(signature1.at).dateTimeWithZone}`, size: 8.5 },
  ];
  // Five lines still fit above the footer rule if the spacing is tightened.
  const lineHeight2 = lines2.length <= 4 ? block2.lineHeight : block2.lineHeight * 0.9;
  drawLines(page2, fonts, block2.x, block2.firstBaseline, lineHeight2, lines2);

  // ── Page 3 ────────────────────────────────────────────────────────────
  const block3 = coords.page3.systemBlock;
  page3.drawLine({
    start: { x: block3.x, y: block3.ruleY },
    end: { x: block3.x + block3.maxWidth, y: block3.ruleY },
    thickness: 0.4,
    color: RULE,
  });

  if (consent) {
    drawCross(page3, coords.page3.consentCheckbox);
    for (const channel of consent.channels) drawCross(page3, coords.page3.channelCheckboxes[channel]);

    const n = coords.page3.name;
    const layout = layoutText(fonts.regular, name, n.maxWidth, range(n.maxFont, n.minFont, 0.5), 2);
    layout.lines.forEach((text, index) => {
      page3.drawText(text, {
        x: n.x,
        y: n.baseline - index * (layout.size + 1.5),
        size: layout.size,
        font: fonts.regular,
        color: INK,
      });
    });

    await drawSignature(doc, page3, coords.page3.signature, consent.signature2.image, coords.maxSignatureScale);

    const lines3: Line[] = [
      { text: "Dane wpisane elektronicznie", ...HEADER },
      { text: `E-mail: ${email}`, size: 8.5 },
      ...(consent.phone ? [{ text: `Telefon: ${consent.phone}`, size: 8.5 }] : []),
      { text: `Data i godzina podpisu: ${formatWarsaw(consent.signature2.at).dateTimeWithZone}`, size: 8.5 },
    ];
    drawLines(page3, fonts, block3.x, block3.firstBaseline, block3.lineHeight, lines3);
  } else {
    const lines3: Line[] = [
      { text: "Adnotacja systemowa", ...HEADER },
      { text: "Zgody na kontakt marketingowy nie udzielono.", size: 8.5 },
      { text: `Data i godzina zapisu: ${formatWarsaw(savedAt).dateTimeWithZone}`, size: 8.5 },
    ];
    drawLines(page3, fonts, block3.x, block3.firstBaseline, block3.lineHeight, lines3);
  }

  // ── Metadata: title + clause version only, never personal data ────────
  doc.setTitle(`${version.pdfTitle} (${version.label})`);
  doc.setSubject(version.label);
  doc.setKeywords([version.id]);
  doc.setProducer("4FF Nieruchomości – klauzula RODO");
  doc.setCreator("4FF Nieruchomości – klauzula RODO");
  doc.setModificationDate(savedAt);

  return doc.save();
}
