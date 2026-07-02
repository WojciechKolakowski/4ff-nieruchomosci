import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";
import type { CmsImage } from "./types";
import { placeholderGradientFor } from "./placeholders";

export interface PropertyCard {
  id: string;
  slug: string;
  title: string;
  status: "draft" | "vip" | "public";
  unlockDate?: string;
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
  description?: string;
}

const galleryProjection = groq`{
  "src": asset->url,
  "alt": coalesce(alt, ""),
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height
}`;

const query = groq`*[_type == "property"] | order(_createdAt desc){
  "id": _id,
  "slug": slug.current,
  title,
  status,
  unlockDate,
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
  "metaItems": coalesce(metaItems, []),
  "description": pt::text(description)
}`;

type RawProperty = Omit<PropertyCard, "placeholderGradient">;

export async function getProperties(): Promise<PropertyCard[]> {
  const raw = await client.fetch<RawProperty[]>(query, {}, { next: { tags: ["property"], revalidate: 3600 } });
  return raw.map((property, index) => ({
    ...property,
    placeholderGradient: placeholderGradientFor(index),
  }));
}
