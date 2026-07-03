import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";

export interface SearchFormConfig {
  locationLabel: string;
  locationOptions: string[];
  propertyTypeLabel: string;
  propertyTypeOptions: string[];
  priceLabel: string;
  priceThresholds: string[];
  submitButtonLabel: string;
}

export type SearchConfigBase = Omit<SearchFormConfig, "locationOptions">;

const query = groq`*[_type == "searchConfig"][0]{
  locationLabel,
  propertyTypeLabel,
  "propertyTypeOptions": coalesce(propertyTypeOptions, []),
  priceLabel,
  "priceThresholds": coalesce(priceThresholds, []),
  submitButtonLabel
}`;

export async function getSearchConfigBase(): Promise<SearchConfigBase> {
  return client.fetch(query, {}, { next: { tags: ["searchConfig"], revalidate: 300 } });
}
