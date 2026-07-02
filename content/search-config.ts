import { powiatyList } from "./powiaty";

export interface SearchFormConfig {
  locationLabel: string;
  locationOptions: string[];
  propertyTypeLabel: string;
  propertyTypeOptions: string[];
  priceLabel: string;
  priceThresholds: string[];
  submitButtonLabel: string;
}

export const searchFormConfig: SearchFormConfig = {
  locationLabel: "Lokalizacja",
  locationOptions: [
    "Cała oferta",
    ...[...powiatyList].sort((a, b) => a.order - b.order).map((p) => p.name),
  ],
  propertyTypeLabel: "Typ nieruchomości",
  propertyTypeOptions: ["Dowolny", "Dom", "Mieszkanie", "Działka", "Lokal"],
  priceLabel: "Cena do",
  priceThresholds: ["Bez limitu", "500 000 zł", "800 000 zł", "1 200 000 zł"],
  submitButtonLabel: "Szukaj",
};
