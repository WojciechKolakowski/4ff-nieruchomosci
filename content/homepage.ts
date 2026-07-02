import { getGlobalSettings } from "./global-settings";
import { getHeroContent } from "./hero";
import { getSearchConfigBase } from "./search-config";
import { getProperties } from "./properties";
import { getWhyUsContent } from "./why-us";
import { getVipProgramContent } from "./vip-program";
import { getTestimonials } from "./testimonials";
import { getPowiatyList } from "./powiaty";
import { getFooterContent } from "./footer";

export async function getHomepageContent() {
  const [global, hero, searchConfigBase, properties, whyUs, vip, testimonials, powiaty, footer] =
    await Promise.all([
      getGlobalSettings(),
      getHeroContent(),
      getSearchConfigBase(),
      getProperties(),
      getWhyUsContent(),
      getVipProgramContent(),
      getTestimonials(),
      getPowiatyList(),
      getFooterContent(),
    ]);

  const searchConfig = {
    ...searchConfigBase,
    locationOptions: ["Cała oferta", ...powiaty.map((p) => p.name)],
  };

  return {
    global,
    hero,
    searchConfig,
    featuredProperties: properties.filter((p) => p.status === "public"),
    whyUs,
    vip,
    vipProperties: properties.filter((p) => p.status === "vip"),
    testimonials,
    powiaty,
    footer,
  };
}
