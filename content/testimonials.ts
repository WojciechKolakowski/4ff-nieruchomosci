import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";

export interface Testimonial {
  id: string;
  quote: string;
  rating: number;
  clientSignature: string;
  location: string;
  visibleOnHomepage: boolean;
}

const query = groq`*[_type == "testimonial" && visibleOnHomepage == true] | order(_createdAt desc){
  "id": _id,
  quote,
  rating,
  clientSignature,
  location,
  visibleOnHomepage
}`;

export async function getTestimonials(): Promise<Testimonial[]> {
  return client.fetch(query, {}, { next: { tags: ["testimonial"], revalidate: 300 } });
}
