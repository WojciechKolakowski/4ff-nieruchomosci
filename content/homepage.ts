import { globalSettings } from "./global-settings";
import { heroContent } from "./hero";
import { searchFormConfig } from "./search-config";
import { properties } from "./properties";
import { whyUsContent } from "./why-us";
import { vipProgramContent } from "./vip-program";
import { testimonials } from "./testimonials";
import { powiatyList } from "./powiaty";
import { footerContent } from "./footer";

export const homepageContent = {
  global: globalSettings,
  hero: heroContent,
  searchConfig: searchFormConfig,
  featuredProperties: properties.filter((p) => p.status === "public"),
  whyUs: whyUsContent,
  vip: vipProgramContent,
  vipProperties: properties.filter((p) => p.status === "vip"),
  testimonials: testimonials.filter((t) => t.visibleOnHomepage),
  powiaty: [...powiatyList].sort((a, b) => a.order - b.order),
  footer: footerContent,
};
