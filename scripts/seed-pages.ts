import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-07-02" });

let keyCounter = 0;
function key(prefix: string) {
  keyCounter += 1;
  return `${prefix}${keyCounter}`;
}

function paragraph(text: string, style: "normal" | "h3" = "normal") {
  return {
    _type: "block",
    _key: key("b"),
    style,
    markDefs: [],
    children: [{ _type: "span", _key: key("s"), text }],
  };
}

async function run() {
  console.log("Seeding page: sprzedaz-nieruchomosci...");
  await client.createOrReplace({
    _id: "page-sprzedaz-nieruchomosci",
    _type: "page",
    title: "Sprzedaż nieruchomości",
    slug: { _type: "slug", current: "sprzedaz-nieruchomosci" },
    metaTitle: "Sprzedaż nieruchomości Łódź i okolice | 4FF Nieruchomości",
    metaDescription:
      "Sprzedajesz dom, mieszkanie lub działkę? Bezpłatna wycena, pełna obsługa prawna i marketingowa od pierwszego kontaktu po akt notarialny. Umów rozmowę.",
    eyebrow: "Nasze usługi",
    heading: "Sprzedaż nieruchomości — od wyceny po klucze w rękach kupującego",
    lead: "Twój dom to nie tylko metry kwadratowe — to Twoja historia. Prowadzimy Cię przez cały proces sprzedaży tak, żebyś nie musiał/a martwić się o żadną formalność.",
    body: [
      paragraph(
        "Sprzedaż nieruchomości zaczynamy od bezpłatnej, rzetelnej wyceny — bez naciągania w górę czy w dół, tylko realna cena rynkowa dopasowana do Twojej okolicy: czy to Powiat Pabianicki, Łódź, Powiat Łódzki Wschodni, Powiat Łaski czy Powiat Zgierski."
      ),
      paragraph(
        "Dalej bierzemy na siebie to, co najbardziej czasochłonne: profesjonalną sesję zdjęciową, home staging, przygotowanie oferty i jej promocję, żeby jak najszybciej dotarła do właściwych kupujących."
      ),
      paragraph(
        "Na każdym etapie masz jedną osobę kontaktową, dostępną 7 dni w tygodniu. Negocjacje, weryfikacja kupującego, przygotowanie dokumentów i obecność przy akcie notarialnym — wszystko pod stałym nadzorem formalnym."
      ),
    ],
    ctaLabel: "Umów bezpłatną konsultację",
    ctaHref: "/#lead",
  });

  console.log("Seeding page: zakup-nieruchomosci...");
  await client.createOrReplace({
    _id: "page-zakup-nieruchomosci",
    _type: "page",
    title: "Zakup nieruchomości",
    slug: { _type: "slug", current: "zakup-nieruchomosci" },
    metaTitle: "Zakup nieruchomości Łódzkie | 4FF Nieruchomości",
    metaDescription:
      "Szukasz domu, mieszkania lub działki? Pomagamy znaleźć, zweryfikować i bezpiecznie kupić nieruchomość — z pełnym wsparciem prawnym i finansowym.",
    eyebrow: "Nasze usługi",
    heading: "Zakup nieruchomości — szukamy razem z Tobą, nie zamiast Ciebie",
    lead: "Kupno nieruchomości to jedna z ważniejszych decyzji w życiu. Chcemy, żebyś podejmował/a ją ze spokojną głową, mając pełny obraz sytuacji prawnej i finansowej.",
    body: [
      paragraph(
        "Zaczynamy od rozmowy o tym, czego naprawdę szukasz — lokalizacji, budżetu, typu nieruchomości. Przeszukujemy naszą bieżącą ofertę w powiatach: Pabianickim, Łódzkim Wschodnim, Łaskim, Zgierskim oraz w samej Łodzi, żeby znaleźć coś, co faktycznie pasuje do Twoich potrzeb."
      ),
      paragraph(
        "Przy każdej nieruchomości sprawdzamy stan prawny — księgę wieczystą, obciążenia, zgodność z planem zagospodarowania. Jeśli interesuje Cię inwestycja na rynku pierwotnym, wyjaśniamy status prawny dewelopera i zabezpieczenia Twoich wpłat."
      ),
      paragraph(
        "Potrzebujesz kredytu? Zobacz stronę Finansowanie / kredyt — pomożemy dobrać odpowiednie rozwiązanie."
      ),
    ],
    ctaLabel: "Zobacz nieruchomości",
    ctaHref: "/nieruchomosci",
  });

  console.log("Seeding page: finansowanie-kredyt...");
  await client.createOrReplace({
    _id: "page-finansowanie-kredyt",
    _type: "page",
    title: "Finansowanie / kredyt",
    slug: { _type: "slug", current: "finansowanie-kredyt" },
    metaTitle: "Finansowanie zakupu nieruchomości | 4FF Nieruchomości",
    metaDescription:
      "Pomagamy dobrać finansowanie zakupu domu, mieszkania lub działki. Skontaktuj się z nami, zanim złożysz wniosek kredytowy.",
    eyebrow: "Nasze usługi",
    heading: "Finansowanie zakupu — zanim podpiszesz cokolwiek w banku",
    lead: "Dobra nieruchomość to połowa sukcesu. Druga połowa to finansowanie dopasowane do Twojej sytuacji — chętnie pomożemy Ci to poukładać.",
    body: [
      paragraph(
        "Wiemy, że formalności kredytowe bywają najbardziej stresującym etapem zakupu nieruchomości. Dlatego pomagamy Ci przejść przez cały proces — od pierwszej rozmowy o zdolności kredytowej, przez wybór najlepszej oferty, po dopięcie formalności zgodnie z harmonogramem transakcji."
      ),
      paragraph(
        "Jesteśmy zarejestrowanym agentem firmy Lendi — jednego z największych pośredników kredytu hipotecznego w Polsce, wpisanego do rejestru pośredników kredytowych prowadzonego przez Komisję Nadzoru Finansowego pod numerem RPH000896 (nasz numer agenta: RHA0018297). W każdej transakcji współpracujemy wyłącznie z Lendi — to gwarantuje pełen profesjonalizm i bezpieczeństwo formalne na każdym etapie procesu kredytowego."
      ),
    ],
    ctaLabel: "Umów bezpłatną konsultację",
    ctaHref: "/#lead",
  });

  console.log("Seeding page: home-staging...");
  await client.createOrReplace({
    _id: "page-home-staging",
    _type: "page",
    title: "Home staging",
    slug: { _type: "slug", current: "home-staging" },
    metaTitle: "Home staging przed sprzedażą | 4FF Nieruchomości",
    metaDescription:
      "Profesjonalne przygotowanie nieruchomości do sprzedaży — home staging i sesja zdjęciowa, które realnie skracają czas sprzedaży.",
    eyebrow: "Nasze usługi",
    heading: "Home staging — pierwsze wrażenie sprzedaje",
    lead: "Ta sama nieruchomość pokazana dobrze i pokazana byle jak to dwie różne oferty w oczach kupującego. Home staging to inwestycja, która się zwraca.",
    body: [
      paragraph(
        "Home staging to profesjonalne przygotowanie wnętrza do prezentacji — uporządkowanie przestrzeni, dobór oświetlenia, drobne poprawki estetyczne, czasem tymczasowe umeblowanie pustych pomieszczeń. Celem jest, żeby kupujący od progu zobaczył potencjał nieruchomości."
      ),
      paragraph(
        "Usługę home stagingu łączymy zawsze z profesjonalną sesją zdjęciową — to pakiet, który oferujemy w ramach przygotowania oferty do sprzedaży. Dotyczy to zarówno domów i mieszkań na rynku wtórnym, jak i lokali pokazowych przy inwestycjach na rynku pierwotnym."
      ),
      paragraph(
        "Home staging nie jest u nas usługą do samodzielnego zakupu — oferujemy go wyłącznie jako element pełnej współpracy przy sprzedaży nieruchomości, w ramach podpisanej z nami umowy pośrednictwa. To świadomy wybór, nie ograniczenie: dzięki temu dopasowujemy zakres stagingu do konkretnej oferty i poświęcamy mu tyle uwagi, na ile zasługuje. Efekt — Twoja nieruchomość trafia do wąskiego grona ofert przygotowanych i zaprezentowanych na poziomie, jakiego na rynku próżno szukać gdzie indziej."
      ),
    ],
    ctaLabel: "Umów bezpłatną konsultację",
    ctaHref: "/#lead",
  });

  console.log("Seeding page: polityka-prywatnosci...");
  await client.createOrReplace({
    _id: "page-polityka-prywatnosci",
    _type: "page",
    title: "Polityka prywatności",
    slug: { _type: "slug", current: "polityka-prywatnosci" },
    metaTitle: "Polityka prywatności | 4FF Nieruchomości",
    metaDescription:
      "Dowiedz się, jak 4FF Sp. z o.o. przetwarza Twoje dane osobowe zgodnie z RODO — w formularzu kontaktowym i plikach cookies.",
    eyebrow: undefined,
    heading: "Polityka prywatności",
    lead: "Twoje dane traktujemy z taką samą odpowiedzialnością, z jaką prowadzimy Twoją transakcję.",
    body: [
      paragraph("1. Administrator danych", "h3"),
      paragraph(
        "Administratorem Twoich danych osobowych jest 4FF Sp. z o.o., NIP 731 207 91 33 („Administrator”). Kontakt w sprawach ochrony danych: biuro@4ffnieruchomosci.pl."
      ),
      paragraph("2. Cele i podstawy przetwarzania", "h3"),
      paragraph(
        "Obsługa zapytania z formularza „Bezpłatna wycena nieruchomości” i formularzy kontaktowych — podstawa: art. 6 ust. 1 lit. b RODO (działania przed zawarciem umowy) oraz lit. f (prawnie uzasadniony interes Administratora)."
      ),
      paragraph(
        "Marketing bezpośredni (informacje o ofertach) — wyłącznie po wyrażeniu odrębnej, dobrowolnej zgody — podstawa: art. 6 ust. 1 lit. a RODO."
      ),
      paragraph(
        "Wypełnienie obowiązków wynikających z ustawy o przeciwdziałaniu praniu pieniędzy oraz finansowaniu terroryzmu (AML) — jako instytucja obowiązana w rozumieniu tej ustawy, weryfikujemy tożsamość klientów przy transakcjach o wartości równej lub przekraczającej równowartość 15 000 euro — podstawa: art. 6 ust. 1 lit. c RODO."
      ),
      paragraph("3. Okres przechowywania danych", "h3"),
      paragraph(
        "Dane z zapytań ofertowych osób, które nie zostały naszymi klientami, przechowujemy przez 12 miesięcy od ostatniego kontaktu. Dane przetwarzane w związku z obowiązkami AML (dotyczące klientów objętych weryfikacją przy transakcjach o wartości równej lub przekraczającej równowartość 15 000 euro) przechowujemy przez 5 lat, zgodnie z ustawą o przeciwdziałaniu praniu pieniędzy oraz finansowaniu terroryzmu."
      ),
      paragraph("4. Odbiorcy danych", "h3"),
      paragraph(
        "Dane mogą być przekazywane podmiotom wspierającym działanie serwisu (hosting, dostawca CMS, narzędzia analityczne i marketingowe wskazane w Ustawieniach cookies) na podstawie umów powierzenia przetwarzania, wyłącznie w zakresie niezbędnym do świadczenia tych usług."
      ),
      paragraph("5. Twoje prawa", "h3"),
      paragraph(
        "Masz prawo dostępu do danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, przenoszenia danych oraz sprzeciwu wobec przetwarzania, a także prawo cofnięcia zgody marketingowej w dowolnym momencie. Przysługuje Ci również prawo wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych."
      ),
      paragraph("6. Pliki cookies", "h3"),
      paragraph(
        "Szczegóły dotyczące plików cookies znajdziesz w Ustawieniach cookies (link w stopce)."
      ),
    ],
  });

  console.log("Seeding page: regulamin...");
  await client.createOrReplace({
    _id: "page-regulamin",
    _type: "page",
    title: "Regulamin",
    slug: { _type: "slug", current: "regulamin" },
    metaTitle: "Regulamin serwisu | 4FF Nieruchomości",
    metaDescription: "Zasady korzystania z serwisu 4ffnieruchomosci.pl.",
    eyebrow: undefined,
    heading: "Regulamin serwisu",
    lead: "Krótko, jasno i bez drobnego druku — tak, jak lubimy prowadzić nasze transakcje.",
    body: [
      paragraph("§1 Postanowienia ogólne", "h3"),
      paragraph(
        "Serwis 4ffnieruchomosci.pl prowadzony jest przez 4FF Sp. z o.o., NIP 731 207 91 33 („Usługodawca”). Regulamin określa zasady korzystania z serwisu."
      ),
      paragraph("§2 Odpowiedzialność", "h3"),
      paragraph(
        "Prezentowane na stronie ceny i dane ofert mają charakter informacyjny i nie stanowią oferty w rozumieniu Kodeksu cywilnego. Wiążące warunki transakcji ustalane są indywidualnie z agentem 4FF."
      ),
      paragraph("§3 Reklamacje", "h3"),
      paragraph(
        "Reklamacje dotyczące działania serwisu można zgłaszać na adres biuro@4ffnieruchomosci.pl. Usługodawca rozpatruje reklamacje w terminie 14 dni."
      ),
      paragraph("§4 Postanowienia końcowe", "h3"),
      paragraph(
        "W sprawach nieuregulowanych Regulaminem zastosowanie mają przepisy prawa polskiego, w tym Kodeksu cywilnego i ustawy o świadczeniu usług drogą elektroniczną."
      ),
    ],
  });
  // NOTE: §2 Definicje (Konto/Program VIP) and the old §3 "Zasady programu
  // 4FF VIP" were removed here because the VIP login program is paused
  // (see components/home/VipSection.tsx). Re-add them, renumbering the
  // sections that follow, once VIP is reactivated — original wording is in
  // git history (commit that removed this block).

  console.log("Done.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
