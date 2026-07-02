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

const logo: CmsImage = {
  src: "/logo.png",
  alt: "4FF Nieruchomości Kołakowscy",
  width: 140,
  height: 140,
};

export const globalSettings: GlobalSettings = {
  logo: { light: logo, dark: logo },
  phone: "+48 505 644 440",
  email: "biuro@4ffnieruchomosci.pl",
  officeAddress: "4FF Sp. z o.o. · NIP 731 207 91 33",
  socialLinks: {
    facebook: "#",
    instagram: "#",
    youtube: "#",
  },
  ctaValuationButtonLabel: "Bezpłatna wycena",
  loginButtonLabel: "Zaloguj się",
  navLinks: [
    { label: "Nieruchomości", href: "#oferty" },
    { label: "Wcześniejszy dostęp", href: "#vip" },
    { label: "O nas", href: "#dlaczego" },
    { label: "Opinie", href: "#opinie" },
    { label: "Kontakt", href: "#kontakt" },
  ],
  trustBarItems: [
    { icon: "☰", before: "Licencja pośrednika ", strong: "PFRN" },
    { icon: "★", strong: "4,9/5", after: " średnia ocena klientów" },
    { icon: "🔒", before: "Bezpieczeństwo prawne ", strong: "na każdym etapie" },
    { icon: "⏰", before: "Kontakt ", strong: "7 dni w tygodniu" },
  ],
};
