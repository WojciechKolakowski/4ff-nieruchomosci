import { groq } from "next-sanity";
import type { PortableTextBlock } from "@portabletext/react";
import { client } from "@/sanity/lib/client";
import type { CmsImage } from "./types";

export interface ArticleListItem {
  slug: string;
  title: string;
  category?: string;
  excerpt?: string;
  coverImage: CmsImage | null;
  publishedAt?: string;
}

export interface ArticleDetail extends ArticleListItem {
  metaTitle?: string;
  metaDescription?: string;
  body: PortableTextBlock[] | null;
}

const imageProjection = groq`{
  "src": asset->url,
  "alt": coalesce(alt, ""),
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height
}`;

const listQuery = groq`*[_type == "article" && defined(slug.current) && publishedAt <= now()] | order(publishedAt desc){
  "slug": slug.current,
  title,
  category,
  excerpt,
  "coverImage": coverImage${imageProjection},
  publishedAt
}`;

export async function getArticleList(): Promise<ArticleListItem[]> {
  return client.fetch(listQuery, {}, { next: { tags: ["article"], revalidate: 300 } });
}

const detailQuery = groq`*[_type == "article" && slug.current == $slug && publishedAt <= now()][0]{
  "slug": slug.current,
  title,
  category,
  excerpt,
  "coverImage": coverImage${imageProjection},
  publishedAt,
  metaTitle,
  metaDescription,
  body
}`;

export async function getArticleBySlug(slug: string): Promise<ArticleDetail | null> {
  return client.fetch<ArticleDetail | null>(detailQuery, { slug }, { cache: "no-store" });
}

const slugsQuery = groq`*[_type == "article" && defined(slug.current) && publishedAt <= now()]{ "slug": slug.current }`;

export async function getAllArticleSlugs(): Promise<{ slug: string }[]> {
  return client.fetch(slugsQuery, {}, { next: { tags: ["article"], revalidate: 300 } });
}
