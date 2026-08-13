import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";
import type { CmsLink } from "./types";

export interface CookieCategory {
  key: "necessary" | "analytics" | "marketing";
  label: string;
  description: string;
}

export interface FooterContent {
  companyDescription: string;
  navLinks: CmsLink[];
  serviceLinks: CmsLink[];
  contactLines: string[];
  copyrightText: string;
  legalLinks: CmsLink[];
  cookieBannerText: string;
  cookieAcceptLabel: string;
  cookieRejectLabel: string;
  cookieCustomizeLabel: string;
  cookieSettingsHeading: string;
  cookieSettingsLead: string;
  cookieSaveLabel: string;
  cookieCategories: CookieCategory[];
}

const query = groq`*[_type == "footer"][0]{
  companyDescription,
  "navLinks": coalesce(navLinks[]{label, href}, []),
  "serviceLinks": coalesce(serviceLinks[]{label, href}, []),
  "contactLines": coalesce(contactLines, []),
  copyrightText,
  "legalLinks": coalesce(legalLinks[]{label, href}, []),
  cookieBannerText,
  cookieAcceptLabel,
  cookieRejectLabel,
  cookieCustomizeLabel,
  cookieSettingsHeading,
  cookieSettingsLead,
  cookieSaveLabel,
  "cookieCategories": [
    { "key": "necessary", "label": cookieCategoryNecessaryLabel, "description": cookieCategoryNecessaryDescription },
    { "key": "analytics", "label": cookieCategoryAnalyticsLabel, "description": cookieCategoryAnalyticsDescription },
    { "key": "marketing", "label": cookieCategoryMarketingLabel, "description": cookieCategoryMarketingDescription }
  ]
}`;

export async function getFooterContent(): Promise<FooterContent> {
  return client.fetch(query, {}, { next: { tags: ["footer"], revalidate: 300 } });
}
