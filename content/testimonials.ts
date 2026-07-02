export interface Testimonial {
  id: string;
  quote: string;
  rating: number;
  clientSignature: string;
  location: string;
  visibleOnHomepage: boolean;
}

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    quote:
      "Sprzedaż działki przebiegła sprawnie, a wszystkie formalności zostały wyjaśnione krok po kroku — bez niespodzianek u notariusza.",
    rating: 5,
    clientSignature: "Klient — sprzedaż działki",
    location: "Powiat łaski",
    visibleOnHomepage: true,
  },
  {
    id: "t2",
    quote:
      "Doceniam profesjonalne zdjęcia i szybki kontakt. Dom sprzedał się szybciej, niż się spodziewaliśmy.",
    rating: 5,
    clientSignature: "Klient — sprzedaż domu",
    location: "Łódź",
    visibleOnHomepage: true,
  },
  {
    id: "t3",
    quote:
      "Jako kupujący czułem się prowadzony przez cały proces — od pierwszej prezentacji po finansowanie kredytu.",
    rating: 5,
    clientSignature: "Klient — zakup mieszkania",
    location: "Lubelszczyzna",
    visibleOnHomepage: true,
  },
];
