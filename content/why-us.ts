export interface WhyUsCard {
  label: string;
  title: string;
  description: string;
}

export interface WhyUsContent {
  eyebrow: string;
  heading: string;
  description: string;
  cards: WhyUsCard[];
}

export const whyUsContent: WhyUsContent = {
  eyebrow: "Dlaczego 4FF",
  heading: "Rodzinne biuro, profesjonalne standardy",
  description:
    "Łączymy osobiste zaangażowanie z pełnym, licencjonowanym zapleczem formalnym transakcji.",
  cards: [
    {
      label: "Bezpieczeństwo",
      title: "Pełny nadzór prawny",
      description:
        "Licencja PFRN i współpraca ze sprawdzonymi notariuszami eliminują ryzyko formalne na każdym etapie transakcji.",
    },
    {
      label: "Marketing",
      title: "Profesjonalna prezentacja",
      description:
        "Sesje zdjęciowe, home staging i dedykowana strona dla każdej nieruchomości — sprzedajemy nie tylko metry, ale historię.",
    },
    {
      label: "Wsparcie",
      title: "Kontakt bez pośpiechu",
      description:
        "Jesteśmy dostępni 7 dni w tygodniu — od pierwszej rozmowy telefonicznej po klucze do nowego domu.",
    },
  ],
};
