import { groq } from "next-sanity";
import type { PortableTextBlock } from "@portabletext/react";
import { client } from "@/sanity/lib/client";
import type { CmsImage } from "./types";

export interface PropertyDetail {
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
  gallery: CmsImage[];
  metaItems: string[];
  description: PortableTextBlock[] | null;
}

const galleryProjection = groq`{
  "src": asset->url,
  "alt": coalesce(alt, ""),
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height
}`;

const query = groq`*[_type == "property" && slug.current == $slug && status == "public"][0]{
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
  "metaItems": coalesce(metaItems, []),
  "description": description
}`;

export async function getPropertyBySlug(slug: string): Promise<PropertyDetail | null> {
  // Deliberately no tag-based caching here: on this generateStaticParams-based
  // route, `next: { tags, revalidate }` kept serving pre-edit data even after
  // clearing .next and restarting the dev server, while the identical query
  // returned fresh data every time when queried directly. The listing page's
  // near-identical query works fine with tag-based caching, so this is scoped
  // to the detail route specifically rather than applied project-wide.
  return client.fetch<PropertyDetail | null>(query, { slug }, { cache: "no-store" });
}
