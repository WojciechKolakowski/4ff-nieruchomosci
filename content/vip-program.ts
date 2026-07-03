import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";

export interface VipStep {
  number: string;
  description: string;
}

export interface VipProgramContent {
  eyebrow: string;
  heading: string;
  description: string;
  steps: VipStep[];
  ctaButtonLabel: string;
}

const query = groq`*[_type == "vipProgram"][0]{
  eyebrow,
  heading,
  description,
  "steps": coalesce(steps, []),
  ctaButtonLabel
}`;

export async function getVipProgramContent(): Promise<VipProgramContent> {
  return client.fetch(query, {}, { next: { tags: ["vipProgram"], revalidate: 300 } });
}
