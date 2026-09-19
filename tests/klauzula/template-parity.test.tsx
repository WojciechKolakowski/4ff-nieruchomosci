import { readFileSync } from "node:fs";
import path from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { VERSIONS } from "@/templates/klauzula-rodo";
import {
  Acknowledgement,
  ClauseView,
  ConsentHeader,
  ConsentStatement,
} from "@/components/klauzula/ClauseView";

/**
 * The clause shown to the client must be word-for-word the approved template.
 *
 * Both sides are reduced to a comparable string:
 *  - PDF: all text items in stream order, minus the running footer
 *    ("… · wersja z … Strona X z 3", baseline y≈30);
 *  - view: the real React components rendered to static HTML, tags stripped.
 * Then ALL whitespace is removed (pdf.js glues/splits words differently
 * around bold runs and justified lines), as are the two purely graphical
 * characters the view draws with CSS instead of text: bullets "•" and the
 * dotted leader "…" after "Imię i nazwisko:".
 */

const FOOTER_MAX_Y = 36;

function normalize(text: string): string {
  return text
    .normalize("NFC")
    .replace(/[•…]/g, "")
    .replace(/\s+/gu, "");
}

function decodeEntities(html: string): string {
  return html
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");
}

async function templateText(file: string): Promise<string> {
  const data = new Uint8Array(readFileSync(file));
  const pdf = await getDocument({ data, verbosity: 0, isEvalSupported: false }).promise;
  const parts: string[] = [];
  for (let pageNo = 1; pageNo <= pdf.numPages; pageNo++) {
    const page = await pdf.getPage(pageNo);
    const textContent = await page.getTextContent();
    for (const item of textContent.items) {
      if (!("str" in item) || item.str === "") continue;
      if (item.transform[5] < FOOTER_MAX_Y) continue;
      parts.push(item.str);
    }
  }
  return parts.join("");
}

function firstDifference(a: string, b: string): string {
  const max = Math.min(a.length, b.length);
  let index = 0;
  while (index < max && a[index] === b[index]) index++;
  const from = Math.max(0, index - 40);
  return [
    `first difference at normalized offset ${index}`,
    `  template: …${a.slice(from, index + 60)}`,
    `  view:     …${b.slice(from, index + 60)}`,
  ].join("\n");
}

describe.each(Object.values(VERSIONS))("klauzula RODO $label", (version) => {
  it("shows exactly the text of the template PDF", async () => {
    const { content } = version;
    const html = renderToStaticMarkup(
      <>
        <ClauseView content={content} />
        <Acknowledgement content={content} />
        <p>{content.signatureCaption}</p>
        <ConsentHeader content={content} />
        <ConsentStatement content={content} />
        <ul>
          {content.consent.channels.map((channel) => (
            <li key={channel.id}>
              <label>{channel.label}</label>
            </li>
          ))}
        </ul>
        <p>{content.consent.nameLabel}</p>
        <p>{content.signatureCaption}</p>
      </>
    );

    const viewText = normalize(decodeEntities(html.replace(/<[^>]*>/g, "")));
    const pdfText = normalize(
      await templateText(
        path.join(process.cwd(), "templates/klauzula-rodo", version.id, version.templateFile)
      )
    );

    if (viewText !== pdfText) {
      throw new Error(
        `View text differs from template.\n${firstDifference(pdfText, viewText)}`
      );
    }
    expect(viewText.length).toBeGreaterThan(5000);
  });

  it("carries the version label printed in the template footer", async () => {
    const data = new Uint8Array(
      readFileSync(
        path.join(process.cwd(), "templates/klauzula-rodo", version.id, version.templateFile)
      )
    );
    const pdf = await getDocument({ data, verbosity: 0, isEvalSupported: false }).promise;
    expect(pdf.numPages).toBe(3);
    for (let pageNo = 1; pageNo <= pdf.numPages; pageNo++) {
      const page = await pdf.getPage(pageNo);
      const text = (await page.getTextContent()).items
        .map((item) => ("str" in item ? item.str : ""))
        .join("");
      expect(text).toContain(version.label);
    }
  });
});
