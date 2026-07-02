import type { SchemaTypeDefinition } from "sanity";

import { link } from "./objects/link";
import { globalSettings } from "./singletons/globalSettings";
import { hero } from "./singletons/hero";
import { searchConfig } from "./singletons/searchConfig";
import { whyUs } from "./singletons/whyUs";
import { vipProgram } from "./singletons/vipProgram";
import { footer } from "./singletons/footer";
import { property } from "./documents/property";
import { testimonial } from "./documents/testimonial";
import { powiat } from "./documents/powiat";

export const schemaTypes: SchemaTypeDefinition[] = [
  link,
  globalSettings,
  hero,
  searchConfig,
  whyUs,
  vipProgram,
  footer,
  property,
  testimonial,
  powiat,
];

export const singletonTypeNames = [
  "globalSettings",
  "hero",
  "searchConfig",
  "whyUs",
  "vipProgram",
  "footer",
];
