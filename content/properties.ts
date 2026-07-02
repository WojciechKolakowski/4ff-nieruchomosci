import type { CmsImage } from "./types";

export interface PropertyCard {
  id: string;
  slug: string;
  title: string;
  status: "draft" | "vip" | "public";
  unlockDate?: string;
  price: number | null;
  priceLabel?: string;
  propertyType: string;
  locationLabel: string;
  powiat?: string;
  areaM2?: number;
  rooms?: number;
  plotSizeM2?: number;
  market: "primary" | "secondary";
  highlightLabel?: string;
  placeholderGradient: string;
  placeholderLabel: string;
  gallery: CmsImage[];
  metaItems: string[];
  description?: string;
}

export const properties: PropertyCard[] = [
  {
    id: "p1",
    slug: "dom-swoboda-premium",
    title: "Dom „Swoboda Premium”, 121 m²",
    status: "public",
    price: 890000,
    priceLabel: "od 890 000 zł",
    propertyType: "Dom",
    locationLabel: "Gmina Dzierżązna · Łódzkie",
    powiat: "Powiat Łaski",
    areaM2: 121,
    rooms: 4,
    plotSizeM2: 600,
    market: "primary",
    highlightLabel: "Nowość",
    placeholderGradient: "linear-gradient(150deg, #8B9264, #4F5636)",
    placeholderLabel: "[ zdjęcie: dom w zabudowie bliźniaczej ]",
    gallery: [],
    metaItems: ["4 pokoje", "Działka 600 m²", "Stan deweloperski"],
  },
  {
    id: "p2",
    slug: "apartamenty-pod77",
    title: "Apartamenty Pod77, 54–67 m²",
    status: "public",
    price: 7900,
    priceLabel: "od 7 900 zł/m²",
    propertyType: "Mieszkanie",
    locationLabel: "Osiedle Bugaj · Łask",
    powiat: "Powiat Łaski",
    market: "primary",
    highlightLabel: "0% prowizji od kupującego",
    placeholderGradient: "linear-gradient(150deg,#B08A56,#5C4326)",
    placeholderLabel: "[ zdjęcie: apartamenty Pod77 ]",
    gallery: [],
    metaItems: ["20 lokali", "Ogrzewanie miejskie", "Rynek pierwotny"],
  },
  {
    id: "p3",
    slug: "komfortowe-siedlisko",
    title: "Komfortowe siedlisko z zabudową",
    status: "public",
    price: null,
    priceLabel: "Cena na zapytanie",
    propertyType: "Dom",
    locationLabel: "Lubelszczyzna",
    market: "secondary",
    highlightLabel: "Rynek wtórny",
    placeholderGradient: "linear-gradient(150deg,#7C8A8F,#33393B)",
    placeholderLabel: "[ zdjęcie: komfortowe siedlisko ]",
    gallery: [],
    metaItems: ["Dom + budynek gosp.", "Duża działka", "Cisza i natura"],
  },
  {
    id: "p4",
    slug: "dom-jednorodzinny-lodzki-wschodni",
    title: "Dom jednorodzinny, 140 m²",
    status: "vip",
    unlockDate: "2026-07-08",
    price: null,
    propertyType: "Dom",
    locationLabel: "Powiat łódzki wschodni",
    powiat: "Powiat Łódzki Wschodni",
    areaM2: 140,
    market: "secondary",
    placeholderGradient: "linear-gradient(150deg,#6B7248,#3A3F27)",
    placeholderLabel: "[ zdjęcie: dom jednorodzinny ]",
    gallery: [],
    metaItems: [],
  },
  {
    id: "p5",
    slug: "dzialka-budowlana-lubelszczyzna",
    title: "Działka budowlana, 1200 m²",
    status: "vip",
    unlockDate: "2026-07-05",
    price: null,
    propertyType: "Działka",
    locationLabel: "Lubelszczyzna",
    plotSizeM2: 1200,
    market: "primary",
    placeholderGradient: "linear-gradient(150deg,#8B9264,#4F5636)",
    placeholderLabel: "[ zdjęcie: działka budowlana ]",
    gallery: [],
    metaItems: [],
  },
  {
    id: "p6",
    slug: "mieszkanie-lodz",
    title: "Mieszkanie, 62 m², 3 pokoje",
    status: "vip",
    unlockDate: "2026-07-09",
    price: null,
    propertyType: "Mieszkanie",
    locationLabel: "Łódź",
    powiat: "Łódź",
    areaM2: 62,
    rooms: 3,
    market: "secondary",
    placeholderGradient: "linear-gradient(150deg,#7C8A8F,#33393B)",
    placeholderLabel: "[ zdjęcie: mieszkanie w Łodzi ]",
    gallery: [],
    metaItems: [],
  },
];
