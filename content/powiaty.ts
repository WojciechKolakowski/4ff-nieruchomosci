import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";

export interface Powiat {
  name: string;
  voivodeship: "łódzkie" | "lubelskie";
  order: number;
}

const query = groq`*[_type == "powiat"] | order(order asc){
  name,
  voivodeship,
  order
}`;

export async function getPowiatyList(): Promise<Powiat[]> {
  return client.fetch(query, {}, { next: { tags: ["powiat"], revalidate: 3600 } });
}
