import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";

export interface ServiceAreaContent {
  eyebrow: string;
  heading: string;
  description: string;
}

const query = groq`*[_type == "serviceArea"][0]{
  eyebrow,
  heading,
  description
}`;

export async function getServiceAreaContent(): Promise<ServiceAreaContent> {
  return client.fetch(query, {}, { next: { tags: ["serviceArea"], revalidate: 3600 } });
}
