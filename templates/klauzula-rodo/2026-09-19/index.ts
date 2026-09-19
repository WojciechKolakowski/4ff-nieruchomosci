import * as content from "./content";
import { coords } from "./coords";

/**
 * One approved version of the clause. To add a new version, copy this
 * directory (e.g. templates/klauzula-rodo/2027-01-15/), replace template.pdf,
 * update content.ts (verbatim!) and coords.ts, then register it in
 * ../index.ts. Old versions stay in the repo. See README-klauzula-rodo.md.
 */
export const version = {
  id: "2026-09-19",
  /** Exactly as printed in the template's footer. */
  label: "wersja z 19.09.2026",
  pdfTitle: "Klauzula informacyjna RODO – 4FF Sp. z o.o.",
  templateFile: "template.pdf",
  content,
  coords,
};

export type ClauseVersion = typeof version;
