// Where the system writes on template.pdf (version 19.09.2026).
//
// Units: PDF points (1/72 in), origin at the BOTTOM-LEFT of an A4 page
// (595.28 x 841.89). Every value below was measured from the template's own
// vector paths and text runs (pdf.js), then checked by rendering the output.
//
// The system only ADDS marks to empty space; it never touches template text.

export type Box = { x: number; y: number; w: number; h: number };

export const coords = {
  pageSize: { w: 595.28, h: 841.89 },

  page2: {
    // Signature line printed by the template: x 362.83–538.58, y 70.03.
    // The acknowledgement text ends at x=392.2 (baseline 94.6) and the last
    // paragraph line's descenders end near y=115, so the signature stays
    // right of x=396 and below y=113.
    signature: { x: 396, y: 72.5, w: 142, h: 40.5 } satisfies Box,
    // Free area left of the signature caption ("(data i czytelny podpis)"
    // starts at x=410.9). Footer rule is at y=39.69.
    dataBlock: { x: 56.69, firstBaseline: 82, lineHeight: 10, maxWidth: 292 },
  },

  page3: {
    // 8x8 pt checkboxes drawn by the template (lower-left corner).
    consentCheckbox: { x: 56.69, y: 684.83, size: 8 },
    channelCheckboxes: {
      phone: { x: 78.69, y: 632.83, size: 8 },
      sms: { x: 78.69, y: 616.83, size: 8 },
      email: { x: 78.69, y: 600.83, size: 8 },
    },
    // "Imię i nazwisko:" label ends at x≈118; the dotted leader runs to
    // x≈294.6 at baseline 576.9. Name may wrap to a 2nd line (nothing below
    // it until the signature line at y=551, which starts at x=362.83).
    name: { x: 122, baseline: 579.6, maxWidth: 228, maxFont: 11, minFont: 7.5, lineHeight: 11 },
    // Signature line printed by the template: x 362.83–538.58, y 551.33.
    // Area above it is empty (channel labels end at x=205).
    signature: { x: 364, y: 553.5, w: 174, h: 58 } satisfies Box,
    // Free area below the caption (baseline 540.8): separator + system block.
    systemBlock: { x: 56.69, ruleY: 524, firstBaseline: 514, lineHeight: 10, maxWidth: 481.9 },
  },

  // Never upscale a signature beyond this many points per source pixel
  // (signatures are exported at ~1200 px wide, so this only guards tiny scribbles).
  maxSignatureScale: 0.5,
};
