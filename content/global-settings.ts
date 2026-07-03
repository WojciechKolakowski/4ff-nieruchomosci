import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";
import type { CmsImage, CmsLink } from "./types";

export interface TrustBarItem {
  icon: string;
  before?: string;
  strong: string;
  after?: string;
}

export interface GlobalSettings {
  logo: { light: CmsImage; dark: CmsImage };
  phone: string;
  email: string;
  officeAddress: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
  };
  ctaValuationButtonLabel: string;
  loginButtonLabel: string;
  navLinks: CmsLink[];
  trustBarItems: TrustBarItem[];
}

const imageProjection = groq`{
  "src": asset->url,
  "alt": coalesce(alt, ""),
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height
}`;

const query = groq`*[_type == "globalSettings"][0]{
  "logo": {
    "light": logoLight${imageProjection},
    "dark": logoDark${imageProjection}
  },
  phone,
  email,
  officeAddress,
  socialLinks,
  ctaValuationButtonLabel,
  loginButtonLabel,
  "navLinks": coalesce(navLinks[]{label, href}, []),
  "trustBarItems": coalesce(trustBarItems[]{icon, before, strong, after}, [])
}`;

export async function getGlobalSettings(): Promise<GlobalSettings> {
  return client.fetch(query, {}, { next: { tags: ["globalSettings"], revalidate: 300 } });
}
