import type { CmsLink } from "./types";

export interface HeroSlide {
  type: "image" | "video";
  order: number;
  tag: string;
  placeholderLabel: string;
  placeholderGradient: string;
  link?: string;
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

export const heroContent: HeroContent = {
  eyebrow: "Biuro nieruchomości · Łódzkie i Lubelskie",
  headlineBefore: "Twój dom, Twoja",
  highlightedWord: "swoboda",
  headlineAfter: "nasza odpowiedzialność",
  description:
    "Od pierwszej prezentacji po podpis u notariusza — prowadzimy Cię przez sprzedaż lub zakup nieruchomości bez stresu, papierologii i niedomówień.",
  primaryButton: { label: "Zobacz nieruchomości", href: "#oferty" },
  secondaryButton: { label: "Umów bezpłatną konsultację", href: "#lead" },
  stats: [
    { value: "12+", label: "lat na rynku" },
    { value: "200+", label: "zrealizowanych transakcji" },
    { value: "10", label: "obsługiwanych powiatów" },
  ],
  slides: [
    {
      type: "image",
      order: 1,
      tag: "Nieruchomość premium",
      placeholderLabel: "[ zdjęcie 1 — dom „Swoboda Premium” ]",
      placeholderGradient: "linear-gradient(150deg,#5C6740,#3A3F27 60%,#262A18)",
    },
    {
      type: "image",
      order: 2,
      tag: "Rynek pierwotny",
      placeholderLabel: "[ zdjęcie 2 — apartamenty Pod77 ]",
      placeholderGradient: "linear-gradient(150deg,#8B9264,#4F5636)",
    },
    {
      type: "video",
      order: 3,
      tag: "Wideo",
      placeholderLabel: "[ miejsce na wideo powitalne biura ]",
      placeholderGradient: "linear-gradient(150deg,#2A2E1C,#141410)",
    },
    {
      type: "image",
      order: 4,
      tag: "Rynek wtórny",
      placeholderLabel: "[ zdjęcie 3 — komfortowe siedlisko ]",
      placeholderGradient: "linear-gradient(150deg,#7C8A8F,#33393B)",
    },
  ],
  leadForm: {
    heading: "Bezpłatna wycena nieruchomości",
    subheading: "Odezwiemy się w ciągu 24h z realną wyceną i planem działania.",
    nameLabel: "Imię i nazwisko",
    namePlaceholder: "Jan Kowalski",
    phoneLabel: "Telefon",
    phonePlaceholder: "+48 500 000 000",
    interestLabel: "Czego szukasz?",
    interestOptions: [
      "Chcę sprzedać nieruchomość",
      "Chcę kupić nieruchomość",
      "Wycena / konsultacja",
    ],
    consentRequiredLabel:
      "Wyrażam zgodę na przetwarzanie danych osobowych w celu kontaktu w sprawie zapytania (wymagane). Zapoznałem się z Polityką prywatności.",
    consentMarketingLabel:
      "Chcę otrzymywać oferty i informacje marketingowe drogą elektroniczną (opcjonalnie).",
    submitButtonLabel: "Wyślij zapytanie",
    rodoNote:
      "Administratorem danych jest 4FF Sp. z o.o. Dane przetwarzane są zgodnie z RODO wyłącznie w celu obsługi zapytania i nie są udostępniane podmiotom trzecim bez Twojej zgody.",
  },
};
