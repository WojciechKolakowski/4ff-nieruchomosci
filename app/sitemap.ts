import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/site";
import { getAllPageSlugs } from "@/content/page";
import { getPublicPropertySlugs } from "@/content/property-listing";

const STATIC_ROUTES = ["/", "/nieruchomosci", "/uslugi"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pageSlugs, propertySlugs] = await Promise.all([
    getAllPageSlugs(),
    getPublicPropertySlugs(),
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

  return [...staticEntries, ...pageEntries, ...propertyEntries];
}
