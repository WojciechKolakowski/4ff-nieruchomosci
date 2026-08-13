import { groq } from "next-sanity";
import type { PortableTextBlock } from "@portabletext/react";
import { client } from "@/sanity/lib/client";

export interface PageContent {
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  eyebrow?: string;
  heading: string;
  lead?: string;
  body: PortableTextBlock[] | null;
  ctaLabel?: string;
  ctaHref?: string;
}

const query = groq`*[_type == "page" && slug.current == $slug][0]{
  "slug": slug.current,
  metaTitle,
  metaDescription,
  eyebrow,
  heading,
  lead,
  body,
  ctaLabel,
  ctaHref
}`;

export async function getPageBySlug(slug: string): Promise<PageContent | null> {
  // See content/property-detail.ts for why this route avoids tag-based
  // caching: on generateStaticParams-based dynamic routes, revalidate+tags
  // kept serving pre-edit data in local testing even after clearing .next.
  return client.fetch<PageContent | null>(query, { slug }, { cache: "no-store" });
}

const slugsQuery = groq`*[_type == "page" && defined(slug.current)]{ "slug": slug.current }`;

export async function getAllPageSlugs(): Promise<{ slug: string }[]> {
  return client.fetch(slugsQuery, {}, { next: { tags: ["page"], revalidate: 300 } });
}
