import fs from "node:fs";
import path from "node:path";
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-07-02" });

function inDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

async function uploadLogo() {
  const filePath = path.join(process.cwd(), "public", "logo.png");
  const buffer = fs.readFileSync(filePath);
  const asset = await client.assets.upload("image", buffer, { filename: "logo.png" });
  return { _type: "image" as const, asset: { _type: "reference" as const, _ref: asset._id }, alt: "4FF Nieruchomości Kołakowscy" };
}

async function seed() {
  console.log("Uploading logo asset...");
  const logo = await uploadLogo();

  console.log("Seeding globalSettings...");
  await client.createOrReplace({
    _id: "globalSettings",
    _type: "globalSettings",
    logoLight: logo,
    logoDark: logo,
    phone: "+48 505 644 440",
    email: "biuro@4ffnieruchomosci.pl",
    officeAddress: "4FF Sp. z o.o. · NIP 731 207 91 33",
    socialLinks: { facebook: "https://facebook.com", instagram: "https://instagram.com", youtube: "https://youtube.com" },
    ctaValuationButtonLabel: "Bezpłatna wycena",
    loginButtonLabel: "Zaloguj się",
    navLinks: [
      { _type: "link", _key: "nav0", label: "Nieruchomości", href: "#oferty" },
      { _type: "link", _key: "nav1", label: "Wcześniejszy dostęp", href: "#vip" },
      { _type: "link", _key: "nav2", label: "O nas", href: "#dlaczego" },
      { _type: "link", _key: "nav3", label: "Opinie", href: "#opinie" },
      { _type: "link", _key: "nav4", label: "Kontakt", href: "#kontakt" },
    ],
    trustBarItems: [
      { _type: "trustBarItem", _key: "trust0", icon: "☰", before: "Licencja pośrednika ", strong: "PFRN" },
      { _type: "trustBarItem", _key: "trust1", icon: "★", strong: "4,9/5", after: " średnia ocena klientów" },
      { _type: "trustBarItem", _key: "trust2", icon: "🔒", before: "Bezpieczeństwo prawne ", strong: "na każdym etapie" },
      { _type: "trustBarItem", _key: "trust3", icon: "⏰", before: "Kontakt ", strong: "7 dni w tygodniu" },
    ],
  });

  console.log("Seeding hero...");
  await client.createOrReplace({
    _id: "hero",
    _type: "hero",
    eyebrow: "Biuro nieruchomości · Łódzkie i Lubelskie",
    headlineBefore: "Twój dom, Twoja",
    highlightedWord: "swoboda",
    headlineAfter: "nasza odpowiedzialność",
    description:
      "Od pierwszej prezentacji po podpis u notariusza — prowadzimy Cię przez sprzedaż lub zakup nieruchomości bez stresu, papierologii i niedomówień.",
    primaryButton: { _type: "link", label: "Zobacz nieruchomości", href: "#oferty" },
    secondaryButton: { _type: "link", label: "Umów bezpłatną konsultację", href: "#lead" },
    stats: [
      { _type: "stat", _key: "stat0", value: "12+", label: "lat na rynku" },
      { _type: "stat", _key: "stat1", value: "200+", label: "zrealizowanych transakcji" },
      { _type: "stat", _key: "stat2", value: "10", label: "obsługiwanych powiatów" },
    ],
    slides: [
      { _type: "heroSlide", _key: "s1", type: "image", tag: "Nieruchomość premium" },
      { _type: "heroSlide", _key: "s2", type: "image", tag: "Rynek pierwotny" },
      { _type: "heroSlide", _key: "s3", type: "video", tag: "Wideo" },
      { _type: "heroSlide", _key: "s4", type: "image", tag: "Rynek wtórny" },
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
  });

  console.log("Seeding searchConfig...");
  await client.createOrReplace({
    _id: "searchConfig",
    _type: "searchConfig",
    locationLabel: "Lokalizacja",
    propertyTypeLabel: "Typ nieruchomości",
    propertyTypeOptions: ["Dowolny", "Dom", "Mieszkanie", "Działka", "Lokal"],
    priceLabel: "Cena do",
    priceThresholds: ["Bez limitu", "500 000 zł", "800 000 zł", "1 200 000 zł"],
    submitButtonLabel: "Szukaj",
  });

  console.log("Seeding whyUs...");
  await client.createOrReplace({
    _id: "whyUs",
    _type: "whyUs",
    eyebrow: "Dlaczego 4FF",
    heading: "Rodzinne biuro, profesjonalne standardy",
    description:
      "Łączymy osobiste zaangażowanie z pełnym, licencjonowanym zapleczem formalnym transakcji.",
    cards: [
      {
        _type: "whyUsCard",
        _key: "c1",
        label: "Bezpieczeństwo",
        title: "Pełny nadzór prawny",
        description:
          "Licencja PFRN i współpraca ze sprawdzonymi notariuszami eliminują ryzyko formalne na każdym etapie transakcji.",
      },
      {
        _type: "whyUsCard",
        _key: "c2",
        label: "Marketing",
        title: "Profesjonalna prezentacja",
        description:
          "Sesje zdjęciowe, home staging i dedykowana strona dla każdej nieruchomości — sprzedajemy nie tylko metry, ale historię.",
      },
      {
        _type: "whyUsCard",
        _key: "c3",
        label: "Wsparcie",
        title: "Kontakt bez pośpiechu",
        description:
          "Jesteśmy dostępni 7 dni w tygodniu — od pierwszej rozmowy telefonicznej po klucze do nowego domu.",
      },
    ],
  });

  console.log("Seeding vipProgram...");
  await client.createOrReplace({
    _id: "vipProgram",
    _type: "vipProgram",
    eyebrow: "Program 4FF VIP",
    heading: "Zobacz nowe oferty 7 dni przed wszystkimi",
    description:
      "Każda nowa nieruchomość trafia najpierw do zalogowanych użytkowników. Dopiero po 7 dniach staje się widoczna publicznie i pojawia się na portalach ogłoszeniowych.",
    steps: [
      { _type: "vipStep", _key: "s1", number: "01", description: "Załóż darmowe konto w mniej niż minutę." },
      { _type: "vipStep", _key: "s2", number: "02", description: "Przeglądaj nowości zanim trafią do internetu." },
      { _type: "vipStep", _key: "s3", number: "03", description: "Umów prezentację jako pierwszy zainteresowany." },
    ],
    ctaButtonLabel: "Załóż bezpłatne konto",
  });

  console.log("Seeding footer...");
  await client.createOrReplace({
    _id: "footer",
    _type: "footer",
    companyDescription:
      "Rodzinne biuro nieruchomości działające na terenie województwa łódzkiego i lubelskiego. Transakcje bez stresu i zbędnych problemów.",
    navLinks: [
      { _type: "link", _key: "nav0", label: "Nieruchomości", href: "#oferty" },
      { _type: "link", _key: "nav1", label: "O nas", href: "#dlaczego" },
      { _type: "link", _key: "nav2", label: "Opinie", href: "#opinie" },
      { _type: "link", _key: "nav3", label: "Obszar działania", href: "#obszar" },
    ],
    serviceLinks: [
      { _type: "link", _key: "svc0", label: "Sprzedaż nieruchomości", href: "#" },
      { _type: "link", _key: "svc1", label: "Zakup nieruchomości", href: "#" },
      { _type: "link", _key: "svc2", label: "Finansowanie / kredyt", href: "#" },
      { _type: "link", _key: "svc3", label: "Home staging", href: "#" },
    ],
    contactLines: [
      "Marta Kołakowska",
      "+48 505 644 440",
      "biuro@4ffnieruchomosci.pl",
      "4FF Sp. z o.o. · NIP 731 207 91 33",
    ],
    copyrightText: "© 2026 4FF Nieruchomości Kołakowscy. Wszelkie prawa zastrzeżone.",
    legalLinks: [
      { _type: "link", _key: "legal0", label: "Polityka prywatności", href: "#" },
      { _type: "link", _key: "legal1", label: "Regulamin", href: "#" },
      { _type: "link", _key: "legal2", label: "Ustawienia cookies", href: "#" },
    ],
    cookieBannerText:
      "Używamy plików cookies analitycznych i marketingowych (m.in. Facebook Pixel, Google Ads), aby lepiej dopasować ofertę. Szczegóły w Polityce prywatności.",
    cookieAcceptLabel: "Akceptuję wszystkie",
    cookieRejectLabel: "Tylko niezbędne",
  });

  console.log("Seeding serviceArea...");
  await client.createOrReplace({
    _id: "serviceArea",
    _type: "serviceArea",
    eyebrow: "Zasięg działania",
    heading: "Dwa regiony, jedno biuro zaufania",
    description:
      "Obsługujemy transakcje nieruchomościowe w powiatach województwa łódzkiego i lubelskiego.",
  });

  console.log("Seeding powiaty...");
  const powiaty: Array<{ id: string; name: string; voivodeship: string; order: number }> = [
    { id: "powiat-pabianicki", name: "Powiat Pabianicki", voivodeship: "łódzkie", order: 1 },
    { id: "powiat-lodz", name: "Łódź", voivodeship: "łódzkie", order: 2 },
    { id: "powiat-lodzki-wschodni", name: "Powiat Łódzki Wschodni", voivodeship: "łódzkie", order: 3 },
    { id: "powiat-laski", name: "Powiat Łaski", voivodeship: "łódzkie", order: 4 },
    { id: "powiat-zgierski", name: "Powiat Zgierski", voivodeship: "łódzkie", order: 5 },
    { id: "powiat-lubelski", name: "Powiat Lubelski", voivodeship: "lubelskie", order: 6 },
    { id: "powiat-krasnostawski", name: "Powiat Krasnostawski", voivodeship: "lubelskie", order: 7 },
    { id: "powiat-swidnicki", name: "Powiat Świdnicki", voivodeship: "lubelskie", order: 8 },
    { id: "powiat-bilgorajski", name: "Powiat Biłgorajski", voivodeship: "lubelskie", order: 9 },
    { id: "powiat-zamojski", name: "Powiat Zamojski", voivodeship: "lubelskie", order: 10 },
    { id: "powiat-janowski", name: "Powiat Janowski", voivodeship: "lubelskie", order: 11 },
  ];
  for (const p of powiaty) {
    await client.createOrReplace({
      _id: p.id,
      _type: "powiat",
      name: p.name,
      voivodeship: p.voivodeship,
      order: p.order,
    });
  }

  console.log("Seeding testimonials...");
  await client.createOrReplace({
    _id: "testimonial-1",
    _type: "testimonial",
    quote:
      "Sprzedaż działki przebiegła sprawnie, a wszystkie formalności zostały wyjaśnione krok po kroku — bez niespodzianek u notariusza.",
    rating: 5,
    clientSignature: "Klient — sprzedaż działki",
    location: "Powiat łaski",
    visibleOnHomepage: true,
  });
  await client.createOrReplace({
    _id: "testimonial-2",
    _type: "testimonial",
    quote: "Doceniam profesjonalne zdjęcia i szybki kontakt. Dom sprzedał się szybciej, niż się spodziewaliśmy.",
    rating: 5,
    clientSignature: "Klient — sprzedaż domu",
    location: "Łódź",
    visibleOnHomepage: true,
  });
  await client.createOrReplace({
    _id: "testimonial-3",
    _type: "testimonial",
    quote:
      "Jako kupujący czułem się prowadzony przez cały proces — od pierwszej prezentacji po finansowanie kredytu.",
    rating: 5,
    clientSignature: "Klient — zakup mieszkania",
    location: "Lubelszczyzna",
    visibleOnHomepage: true,
  });

  console.log("Seeding properties...");
  await client.createOrReplace({
    _id: "property-1",
    _type: "property",
    title: "Dom „Swoboda Premium”, 121 m²",
    slug: { _type: "slug", current: "dom-swoboda-premium" },
    status: "public",
    price: 890000,
    priceLabel: "od 890 000 zł",
    propertyType: "Dom",
    locationLabel: "Gmina Dzierżązna · Łódzkie",
    powiat: { _type: "reference", _ref: "powiat-laski" },
    areaM2: 121,
    rooms: 4,
    plotSizeM2: 600,
    market: "primary",
    highlightLabel: "Nowość",
    metaItems: ["4 pokoje", "Działka 600 m²", "Stan deweloperski"],
  });
  await client.createOrReplace({
    _id: "property-2",
    _type: "property",
    title: "Apartamenty Pod77, 54–67 m²",
    slug: { _type: "slug", current: "apartamenty-pod77" },
    status: "public",
    price: 7900,
    priceLabel: "od 7 900 zł/m²",
    propertyType: "Mieszkanie",
    locationLabel: "Osiedle Bugaj · Łask",
    powiat: { _type: "reference", _ref: "powiat-laski" },
    market: "primary",
    highlightLabel: "0% prowizji od kupującego",
    metaItems: ["20 lokali", "Ogrzewanie miejskie", "Rynek pierwotny"],
  });
  await client.createOrReplace({
    _id: "property-3",
    _type: "property",
    title: "Komfortowe siedlisko z zabudową",
    slug: { _type: "slug", current: "komfortowe-siedlisko" },
    status: "public",
    priceLabel: "Cena na zapytanie",
    propertyType: "Dom",
    locationLabel: "Lubelszczyzna",
    market: "secondary",
    highlightLabel: "Rynek wtórny",
    metaItems: ["Dom + budynek gosp.", "Duża działka", "Cisza i natura"],
  });
  await client.createOrReplace({
    _id: "property-4",
    _type: "property",
    title: "Dom jednorodzinny, 140 m²",
    slug: { _type: "slug", current: "dom-jednorodzinny-lodzki-wschodni" },
    status: "vip",
    unlockDate: inDays(6),
    propertyType: "Dom",
    locationLabel: "Powiat łódzki wschodni",
    powiat: { _type: "reference", _ref: "powiat-lodzki-wschodni" },
    areaM2: 140,
    market: "secondary",
  });
  await client.createOrReplace({
    _id: "property-5",
    _type: "property",
    title: "Działka budowlana, 1200 m²",
    slug: { _type: "slug", current: "dzialka-budowlana-lubelszczyzna" },
    status: "vip",
    unlockDate: inDays(3),
    propertyType: "Działka",
    locationLabel: "Lubelszczyzna",
    plotSizeM2: 1200,
    market: "primary",
  });
  await client.createOrReplace({
    _id: "property-6",
    _type: "property",
    title: "Mieszkanie, 62 m², 3 pokoje",
    slug: { _type: "slug", current: "mieszkanie-lodz" },
    status: "vip",
    unlockDate: inDays(7),
    propertyType: "Mieszkanie",
    locationLabel: "Łódź",
    powiat: { _type: "reference", _ref: "powiat-lodz" },
    areaM2: 62,
    rooms: 3,
    market: "secondary",
  });

  console.log("Done.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
