import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";

export interface WhyUsCard {
  label: string;
  title: string;
  description: string;
}

export interface WhyUsContent {
  eyebrow: string;
  heading: string;
  description: string;
  cards: WhyUsCard[];
}

const query = groq`*[_type == "whyUs"][0]{
  eyebrow,
  heading,
  description,
  "cards": coalesce(cards, [])
}`;

export async function getWhyUsContent(): Promise<WhyUsContent> {
  return client.fetch(query, {}, { next: { tags: ["whyUs"], revalidate: 3600 } });
}
