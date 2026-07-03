import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";
import type { CmsImage } from "./types";
import { placeholderGradientFor } from "./placeholders";

export interface PropertyListingItem {
  id: string;
  slug: string;
  title: string;
  price: number | null;
  priceLabel?: string;
  propertyType: string;
  locationLabel: string;
  powiat?: string;
  areaM2?: number;
  rooms?: number;
  plotSizeM2?: number;
  market: "primary" | "secondary";
  highlightLabel?: string;
  placeholderGradient: string;
  gallery: CmsImage[];
  metaItems: string[];
}

export interface PropertyListingFilters {
  powiat: string;
  propertyType: string;
  maxPrice: number;
}

const galleryProjection = groq`{
  "src": asset->url,
  "alt": coalesce(alt, ""),
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height
}`;

const listingQuery = groq`*[
  _type == "property"
  && status == "public"
  && ($powiat == "" || powiat->name == $powiat)
  && ($propertyType == "" || propertyType == $propertyType)
  && ($maxPrice == 0 || price <= $maxPrice)
] | order(_createdAt desc){
  "id": _id,
  "slug": slug.current,
  title,
  price,
  priceLabel,
  propertyType,
  locationLabel,
  "powiat": powiat->name,
  areaM2,
  rooms,
  plotSizeM2,
  market,
  highlightLabel,
  "gallery": coalesce(gallery[]${galleryProjection}, []),
  "metaItems": coalesce(metaItems, [])
}`;

type RawPropertyListingItem = Omit<PropertyListingItem, "placeholderGradient">;

export async function getPropertyListing(
  filters: PropertyListingFilters
): Promise<PropertyListingItem[]> {
  const raw = await client.fetch<RawPropertyListingItem[]>(
    listingQuery,
    filters,
    { next: { tags: ["property"], revalidate: 300 } }
  );
  return raw.map((property, index) => ({
    ...property,
    placeholderGradient: placeholderGradientFor(index),
  }));
}

const slugsQuery = groq`*[_type == "property" && status == "public" && defined(slug.current)]{
  "slug": slug.current
}`;

export async function getPublicPropertySlugs(): Promise<{ slug: string }[]> {
  return client.fetch(slugsQuery, {}, { next: { tags: ["property"], revalidate: 300 } });
}
