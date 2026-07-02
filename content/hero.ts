import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";
import type { CmsImage, CmsLink } from "./types";
import { placeholderGradientFor } from "./placeholders";

export interface HeroSlide {
  type: "image" | "video";
  tag: string;
  link?: string;
  image?: CmsImage;
  videoUrl?: string;
  placeholderGradient: string;
}

export interface HeroStat {
  value: string;
  label: string;
}

export interface LeadFormContent {
  heading: string;
  subheading: string;
  nameLabel: string;
  namePlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  interestLabel: string;
  interestOptions: string[];
  consentRequiredLabel: string;
  consentMarketingLabel: string;
  submitButtonLabel: string;
  rodoNote: string;
}

export interface HeroContent {
  eyebrow: string;
  headlineBefore: string;
  highlightedWord: string;
  headlineAfter: string;
  description: string;
  primaryButton: CmsLink;
  secondaryButton: CmsLink;
  stats: HeroStat[];
  slides: HeroSlide[];
  leadForm: LeadFormContent;
}

const imageProjection = groq`{
  "src": asset->url,
  "alt": coalesce(alt, ""),
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height
}`;

const query = groq`*[_type == "hero"][0]{
  eyebrow,
  headlineBefore,
  highlightedWord,
  headlineAfter,
  description,
  primaryButton,
  secondaryButton,
  "stats": coalesce(stats, []),
  "slides": coalesce(slides[]{
    type,
    tag,
    link,
    "image": image${imageProjection},
    "videoUrl": video
  }, []),
  "leadForm": {
    "heading": leadForm.heading,
    "subheading": leadForm.subheading,
    "nameLabel": leadForm.nameLabel,
    "namePlaceholder": leadForm.namePlaceholder,
    "phoneLabel": leadForm.phoneLabel,
    "phonePlaceholder": leadForm.phonePlaceholder,
    "interestLabel": leadForm.interestLabel,
    "interestOptions": coalesce(leadForm.interestOptions, []),
    "consentRequiredLabel": leadForm.consentRequiredLabel,
    "consentMarketingLabel": leadForm.consentMarketingLabel,
    "submitButtonLabel": leadForm.submitButtonLabel,
    "rodoNote": leadForm.rodoNote
  }
}`;

type RawHero = Omit<HeroContent, "slides"> & {
  slides: Array<Omit<HeroSlide, "placeholderGradient">>;
};

export async function getHeroContent(): Promise<HeroContent> {
  const raw = await client.fetch<RawHero>(query, {}, { next: { tags: ["hero"], revalidate: 3600 } });

  return {
    ...raw,
    slides: raw.slides.map((slide, index) => ({
      ...slide,
      placeholderGradient: placeholderGradientFor(index),
    })),
  };
}
