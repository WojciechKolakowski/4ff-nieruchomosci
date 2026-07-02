import type { CmsLink } from "./types";

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
}

export const footerContent: FooterContent = {
  companyDescription:
    "Rodzinne biuro nieruchomości działające na terenie województwa łódzkiego i lubelskiego. Transakcje bez stresu i zbędnych problemów.",
  navLinks: [
    { label: "Nieruchomości", href: "#oferty" },
    { label: "O nas", href: "#dlaczego" },
    { label: "Opinie", href: "#opinie" },
    { label: "Obszar działania", href: "#obszar" },
  ],
  serviceLinks: [
    { label: "Sprzedaż nieruchomości", href: "#" },
    { label: "Zakup nieruchomości", href: "#" },
    { label: "Finansowanie / kredyt", href: "#" },
    { label: "Home staging", href: "#" },
  ],
  contactLines: [
    "Marta Kołakowska",
    "+48 505 644 440",
    "biuro@4ffnieruchomosci.pl",
    "4FF Sp. z o.o. · NIP 731 207 91 33",
  ],
  copyrightText: "© 2026 4FF Nieruchomości Kołakowscy. Wszelkie prawa zastrzeżone.",
  legalLinks: [
    { label: "Polityka prywatności", href: "#" },
    { label: "Regulamin", href: "#" },
    { label: "Ustawienia cookies", href: "#" },
  ],
  cookieBannerText:
    "Używamy plików cookies analitycznych i marketingowych (m.in. Facebook Pixel, Google Ads), aby lepiej dopasować ofertę. Szczegóły w Polityce prywatności.",
  cookieAcceptLabel: "Akceptuję wszystkie",
  cookieRejectLabel: "Tylko niezbędne",
};
