import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/site";
import { getAllPageSlugs } from "@/content/page";
import { getPublicPropertySlugs } from "@/content/property-listing";
import { getAllArticleSlugs } from "@/content/poradnik";

const STATIC_ROUTES = ["/", "/nieruchomosci", "/uslugi", "/poradnik"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pageSlugs, propertySlugs, articleSlugs] = await Promise.all([
    getAllPageSlugs(),
    getPublicPropertySlugs(),
    getAllArticleSlugs(),
  ]);

  const staticEntries = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
  }));

  const pageEntries = pageSlugs.map(({ slug }) => ({
    url: `${SITE_URL}/${slug}`,
    lastModified: new Date(),
  }));

  const propertyEntries = propertySlugs.map(({ slug }) => ({
    url: `${SITE_URL}/nieruchomosci/${slug}`,
    lastModified: new Date(),
  }));

  const articleEntries = articleSlugs.map(({ slug }) => ({
    url: `${SITE_URL}/poradnik/${slug}`,
    lastModified: new Date(),
  }));

  return [...staticEntries, ...pageEntries, ...propertyEntries, ...articleEntries];
}
