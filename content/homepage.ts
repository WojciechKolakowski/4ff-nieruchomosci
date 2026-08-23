import { getGlobalSettings } from "./global-settings";
import { getHeroContent } from "./hero";
import { getSearchConfigBase } from "./search-config";
import { getProperties } from "./properties";
import { getWhyUsContent } from "./why-us";
import { getPowiatyList } from "./powiaty";
import { getFooterContent } from "./footer";
import { getServiceAreaContent } from "./service-area";

export async function getHomepageContent() {
  const [
    global,
    hero,
    searchConfigBase,
    properties,
    whyUs,
    powiaty,
    footer,
    serviceArea,
  ] = await Promise.all([
    getGlobalSettings(),
    getHeroContent(),
    getSearchConfigBase(),
    getProperties(),
    getWhyUsContent(),
    getPowiatyList(),
    getFooterContent(),
    getServiceAreaContent(),
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
    powiaty,
    footer,
    serviceArea,
  };
}
