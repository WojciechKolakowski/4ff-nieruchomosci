import type { SchemaTypeDefinition } from "sanity";

import { link } from "./objects/link";
import { globalSettings } from "./singletons/globalSettings";
import { hero } from "./singletons/hero";
import { searchConfig } from "./singletons/searchConfig";
import { whyUs } from "./singletons/whyUs";
import { vipProgram } from "./singletons/vipProgram";
import { footer } from "./singletons/footer";
import { serviceArea } from "./singletons/serviceArea";
import { property } from "./documents/property";
import { testimonial } from "./documents/testimonial";
import { powiat } from "./documents/powiat";
import { page } from "./documents/page";
import { article } from "./documents/article";
import { leadSubmission } from "./documents/leadSubmission";

export const schemaTypes: SchemaTypeDefinition[] = [
  link,
  globalSettings,
  hero,
  searchConfig,
  whyUs,
  vipProgram,
  footer,
  serviceArea,
  property,
  testimonial,
  powiat,
  page,
  article,
  leadSubmission,
];

export const singletonTypeNames = [
  "globalSettings",
  "hero",
  "searchConfig",
  "whyUs",
  "vipProgram",
  "footer",
  "serviceArea",
];
