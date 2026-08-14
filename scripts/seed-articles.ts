import fs from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";

const envPath = path.join(process.cwd(), ".env.local");
for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
  const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (match && !process.env[match[1]]) {
    process.env[match[1]] = match[2].trim();
  }
}

const client = createClient({
  projectId: "cq8g17f4",
  dataset: "production",
  apiVersion: "2026-07-02",
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
});

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

function tip(heading: string, text: string) {
  return [paragraph(heading, "h3"), paragraph(text)];
}

const now = new Date();
function daysAgo(days: number): string {
  const d = new Date(now);
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

const articles = [
  {
    _id: "article-przygotowanie-do-sprzedazy",
    title: "5 rzeczy, które warto zrobić, zanim wystawisz mieszkanie na sprzedaż",
    slug: "5-rzeczy-przed-sprzedaza-mieszkania",
    category: "Sprzedaż",
    metaTitle: "5 rzeczy przed sprzedażą mieszkania | Poradnik 4FF Nieruchomości",
    metaDescription:
      "Zanim dodasz ogłoszenie, sprawdź te pięć rzeczy — to one najczęściej decydują, czy telefon dzwoni w pierwszym tygodniu, czy dopiero po miesiącu.",
    excerpt:
      "Zanim dodasz ogłoszenie, sprawdź te pięć rzeczy — to one najczęściej decydują, czy telefon dzwoni w pierwszym tygodniu, czy dopiero po miesiącu.",
    publishedAt: daysAgo(28),
    body: [
      paragraph(
        "Sprzedaż nieruchomości zaczyna się na długo przed pierwszym zdjęciem. Poniżej pięć rzeczy, które w naszej codziennej pracy najczęściej robią różnicę między szybką sprzedażą a ofertą, która wisi w internecie miesiącami."
      ),
      ...tip(
        "1. Zrób porządek, zanim zrobisz zdjęcia",
        "Brzmi banalnie, ale to najczęściej pomijany krok. Nadmiar rzeczy osobistych i bałagan na zdjęciach sprawiają, że kupujący widzi cudze życie zamiast wyobrazić sobie własne. Im mniej na blatach i półkach, tym większe wydaje się wnętrze."
      ),
      ...tip(
        "2. Napraw drobne usterki",
        "Cieknący kran, poluzowana klamka czy odklejająca się listwa przypodłogowa same w sobie nie są dużym problemem — ale w głowie kupującego sumują się w pytanie: co jeszcze tu nie działa? Drobne naprawy kosztują niewiele, a realnie wpływają na pierwsze wrażenie."
      ),
      ...tip(
        "3. Skompletuj dokumenty zawczasu",
        "Księga wieczysta, zaświadczenie o braku zaległości, rzuty mieszkania — im szybciej to wszystko jest gotowe, tym szybciej można przejść od 'jestem zainteresowany' do podpisania umowy. Brak dokumentów w kluczowym momencie potrafi wystudzić nawet zdecydowanego kupującego."
      ),
      ...tip(
        "4. Ustal cenę realną, nie życzeniową",
        "Cena zawyżona o 10-15% względem rynku nie przyciąga 'lepszych' kupujących — zwykle przyciąga mniej zainteresowania w ogóle, a oferta 'starzeje się' na portalach, co dodatkowo obniża jej wiarygodność. Rzetelna wycena na starcie to najkrótsza droga do dobrej transakcji."
      ),
      ...tip(
        "5. Pomyśl o pierwszym wrażeniu od progu",
        "Klatka schodowa, zapach w mieszkaniu, oświetlenie przy wejściu — decyzja emocjonalna często zapada w pierwszych 30 sekundach wizyty. Warto zadbać o ten moment tak samo starannie, jak o samo wnętrze."
      ),
      paragraph(
        "Jeśli wolisz, żeby ktoś przeprowadził Cię przez to wszystko krok po kroku — od wyceny po klucze w rękach kupującego — chętnie pomożemy."
      ),
    ],
  },
  {
    _id: "article-wycena-nieruchomosci",
    title: "Ile naprawdę jest warta Twoja nieruchomość? Krótki przewodnik po wycenie",
    slug: "ile-warta-jest-nieruchomosc-wycena",
    category: "Sprzedaż",
    metaTitle: "Jak wycenić nieruchomość? Przewodnik | Poradnik 4FF Nieruchomości",
    metaDescription:
      "Cena z portalu ogłoszeniowego to nie to samo co realna wartość rynkowa. Sprawdź, co faktycznie wpływa na wycenę nieruchomości.",
    excerpt:
      "Cena z ogłoszenia sąsiada to nie wycena. Sprawdź, co faktycznie decyduje o realnej wartości rynkowej nieruchomości.",
    publishedAt: daysAgo(24),
    body: [
      paragraph(
        "Jedno z najczęstszych pytań, jakie słyszymy: 'sąsiad sprzedał za tyle, to ja chyba też tyle dostanę?'. Odpowiedź prawie zawsze brzmi: to zależy od znacznie więcej czynników, niż się wydaje."
      ),
      ...tip(
        "Metraż to dopiero początek",
        "Cena za m² potrafi się różnić nawet w obrębie jednej ulicy — piętro, strona świata, układ pomieszczeń, stan instalacji czy rok budowy realnie wpływają na wartość, nawet jeśli metraż jest identyczny."
      ),
      ...tip(
        "Ceny ofertowe to nie ceny transakcyjne",
        "Ogłoszenia w internecie pokazują, za ile ktoś CHCE sprzedać — nie za ile faktycznie sprzedał. Rzetelna wycena bazuje na realnych cenach transakcyjnych z okolicy, nie na życzeniach innych sprzedających."
      ),
      ...tip(
        "Stan prawny ma swoją cenę",
        "Nieuregulowana księga wieczysta, obciążenia czy niejasny status prawny gruntu obniżają wartość rynkową — nawet jeśli samo mieszkanie czy dom prezentuje się świetnie."
      ),
      ...tip(
        "Otoczenie zmienia się szybciej, niż myślisz",
        "Nowa linia tramwajowa, planowana inwestycja, zmiana w miejscowym planie zagospodarowania — to wszystko może podnieść albo obniżyć wartość nieruchomości w ciągu kilku miesięcy."
      ),
      paragraph(
        "Dlatego zamiast zgadywać, warto zacząć od bezpłatnej, rzetelnej wyceny — bez naciągania w górę czy w dół, tylko realna cena rynkowa dopasowana do konkretnej nieruchomości i okolicy."
      ),
    ],
  },
  {
    _id: "article-rynek-mniejszych-miast",
    title:
      "Pabianice, Łask, Zgierz czy Łódź? Dlaczego rynek nieruchomości w mniejszych miastach rządzi się innymi prawami",
    slug: "rynek-nieruchomosci-mniejsze-miasta-a-lodz",
    category: "Sprzedaż",
    metaTitle: "Rynek nieruchomości: mniejsze miasta a Łódź | Poradnik 4FF Nieruchomości",
    metaDescription:
      "Pabianice, Łask czy Zgierz to inny rynek niż Łódź. Sprawdź, czym różni się sprzedaż i zakup nieruchomości w mniejszych miastach województwa łódzkiego.",
    excerpt:
      "Rynek nieruchomości w Pabianicach, Łasku czy Zgierzu rządzi się innymi prawami niż w Łodzi — i to nie jest tylko kwestia ceny za metr.",
    publishedAt: daysAgo(19),
    body: [
      paragraph(
        "Na co dzień pracujemy zarówno w Łodzi, jak i w mniejszych miastach regionu — Pabianicach, Łasku, Zgierzu, powiecie łódzkim wschodnim. I choć dzieli je kilkanaście czy kilkadziesiąt kilometrów, to rynki nieruchomości potrafią działać zupełnie inaczej."
      ),
      ...tip(
        "Kupujący to sąsiedzi, nie inwestorzy",
        "W dużym mieście spory udział transakcji to zakupy inwestycyjne — pod wynajem, na przeczekanie. W mniejszych miejscowościach zdecydowana większość kupujących to rodziny, które faktycznie chcą tam zamieszkać. To zmienia sposób prezentowania oferty i argumenty, które realnie działają."
      ),
      ...tip(
        "Mniej ofert, więcej lokalnej wiedzy",
        "Mniejszy rynek to mniejsza liczba porównywalnych transakcji — co utrudnia amatorską wycenę 'na oko'. Tu bardziej niż gdziekolwiek indziej liczy się znajomość konkretnej ulicy, dzielnicy czy nawet konkretnego bloku."
      ),
      ...tip(
        "Czas sprzedaży wygląda inaczej",
        "W Łodzi dobra oferta potrafi zniknąć w kilka dni dzięki samej skali rynku. W mniejszych miastach dobra oferta też się sprzedaje szybko — ale dotarcie do właściwego kupującego często wymaga innych kanałów niż w wielkim mieście."
      ),
      ...tip(
        "Lokalna reputacja ma znaczenie",
        "W mniejszej społeczności opinia o agencji czy agencie rozchodzi się szybciej — i szybciej wraca w postaci kolejnych poleceń. To dlatego traktujemy każdą transakcję w Pabianicach czy Łasku z taką samą uwagą, jak transakcję w centrum Łodzi."
      ),
      paragraph(
        "Dla nas klienci z mniejszych miast to nie 'dodatek' do rynku łódzkiego — to jego pełnoprawna, ważna część, którą znamy równie dobrze."
      ),
    ],
  },
  {
    _id: "article-pulapki-zakupu",
    title: "5 pułapek przy zakupie nieruchomości, których unikniesz z agencją",
    slug: "pulapki-przy-zakupie-nieruchomosci",
    category: "Zakup",
    metaTitle: "Pułapki przy zakupie nieruchomości | Poradnik 4FF Nieruchomości",
    metaDescription:
      "Poznaj 5 najczęstszych pułapek przy zakupie nieruchomości i dowiedz się, jak profesjonalna agencja pomaga ich uniknąć.",
    excerpt:
      "Zakup nieruchomości to jedna z ważniejszych decyzji w życiu — a te pięć pułapek potrafi kosztować najwięcej nerwów i pieniędzy.",
    publishedAt: daysAgo(15),
    body: [
      paragraph(
        "Większość problemów przy zakupie nieruchomości da się przewidzieć — jeśli wiesz, na co patrzeć. Oto pięć sytuacji, które w naszej praktyce pojawiają się najczęściej."
      ),
      ...tip(
        "1. Niejasny stan prawny",
        "Nieuregulowana księga wieczysta, brak zgodności danych w rejestrach, roszczenia osób trzecich — to problemy, które ujawniają się dopiero przy dokładnej weryfikacji, a nie podczas jednej wizyty na oglądaniu."
      ),
      ...tip(
        "2. Ukryte obciążenia",
        "Hipoteka, służebność, zaległości wobec wspólnoty czy spółdzielni — jeśli nie sprawdzisz tego przed podpisaniem umowy przedwstępnej, możesz odziedziczyć cudzy problem finansowy razem z kluczami."
      ),
      ...tip(
        "3. Presja czasu przy zadatku",
        "'Jest inny chętny, musi Pan/Pani zdecydować dziś' to sygnał ostrzegawczy, nie okazja. Pośpiech przy wpłacie zadatku to jeden z najczęstszych powodów, dla których kupujący później żałują decyzji."
      ),
      ...tip(
        "4. Niezgodność ze stanem faktycznym",
        "Samowola budowlana, niezgłoszona rozbudowa, metraż inny niż w dokumentach — takie rozbieżności mogą oznaczać problemy formalne długo po zakupie, a nie tylko estetyczne rozczarowanie."
      ),
      ...tip(
        "5. Brak zabezpieczenia wpłat na rynku pierwotnym",
        "Przy zakupie od dewelopera kluczowe jest sprawdzenie, czy Twoje wpłaty są odpowiednio zabezpieczone (np. rachunek powierniczy) — bez tego w razie problemów dewelopera ryzykujesz utratę środków."
      ),
      paragraph(
        "Dobra agencja nie tylko pokazuje mieszkania — przede wszystkim odsiewa te, które kryją w sobie powyższe problemy, zanim w ogóle trafią do Twojej listy do obejrzenia."
      ),
    ],
  },
  {
    _id: "article-jak-sprawdzamy-stan-prawny",
    title: "Jak sprawdzamy stan prawny nieruchomości, zanim zapłacisz zadatek",
    slug: "jak-sprawdzamy-stan-prawny-nieruchomosci",
    category: "Zakup",
    metaTitle: "Jak sprawdzamy stan prawny nieruchomości | 4FF Nieruchomości",
    metaDescription:
      "Zanim polecimy Ci nieruchomość, przechodzimy przez konkretną listę kontrolną stanu prawnego. Zobacz, co dokładnie sprawdzamy.",
    excerpt:
      "Zanim jakakolwiek oferta trafi do Ciebie jako polecana, przechodzi przez naszą listę kontrolną stanu prawnego. Oto co dokładnie sprawdzamy.",
    publishedAt: daysAgo(10),
    body: [
      paragraph(
        "Zanim polecimy Ci konkretną nieruchomość — a już na pewno zanim doradzimy wpłatę zadatku — przechodzimy przez konkretną listę kontrolną. To nie jest formalność 'na pokaz', tylko standardowa część naszej pracy przy każdej transakcji."
      ),
      ...tip(
        "Sprawdzamy księgę wieczystą",
        "Kto jest faktycznym właścicielem, czy dane się zgadzają, czy nie ma wpisanych hipotek, służebności czy roszczeń osób trzecich, które mogłyby skomplikować transakcję."
      ),
      ...tip(
        "Weryfikujemy zaległości i obciążenia",
        "Pytamy o zaświadczenia od wspólnoty lub spółdzielni, sprawdzamy, czy nie ma zaległości czynszowych czy innych zobowiązań powiązanych z nieruchomością."
      ),
      ...tip(
        "Porównujemy stan faktyczny z dokumentacją",
        "Sprawdzamy, czy metraż, układ pomieszczeń i ewentualne rozbudowy są zgodne z tym, co widnieje w dokumentach — rozbieżności to sygnał do dalszej weryfikacji, zanim posuniemy się dalej."
      ),
      ...tip(
        "Sprawdzamy zgodność z planem zagospodarowania",
        "Szczególnie przy działkach i domach — upewniamy się, że planowane wykorzystanie nieruchomości jest zgodne z miejscowym planem zagospodarowania przestrzennego lub warunkami zabudowy."
      ),
      ...tip(
        "Weryfikujemy tożsamość i umocowanie sprzedającego",
        "Sprawdzamy, czy osoba sprzedająca faktycznie ma prawo do rozporządzania nieruchomością — samodzielnie, czy np. w imieniu współwłaścicieli lub na podstawie pełnomocnictwa."
      ),
      paragraph(
        "Dopiero po tym etapie mówimy Ci: 'ta oferta jest bezpieczna, można iść dalej'. To właśnie ta praca w tle — niewidoczna na zdjęciach w ogłoszeniu — najczęściej decyduje o tym, czy transakcja przebiega bez niespodzianek."
      ),
    ],
  },
  {
    _id: "article-puste-mieszkanie-trudniej",
    title: "Home staging: dlaczego puste mieszkanie sprzedaje się trudniej",
    slug: "dlaczego-puste-mieszkanie-sprzedaje-sie-trudniej",
    category: "Home staging",
    metaTitle: "Dlaczego puste mieszkanie sprzedaje się trudniej | Poradnik 4FF",
    metaDescription:
      "Puste wnętrze to nie 'czysta kartka' dla kupującego — to często zimne i mniej przekonujące doświadczenie. Sprawdź, dlaczego home staging działa.",
    excerpt:
      "Wydaje się, że puste mieszkanie to 'czysta kartka' dla kupującego. W praktyce działa odwrotnie — i mamy na to konkretne powody.",
    publishedAt: daysAgo(7),
    body: [
      paragraph(
        "Intuicja podpowiada, że puste mieszkanie to najlepszy punkt wyjścia — kupujący sam sobie 'dorysuje' urządzenie wnętrza. W praktyce dzieje się coś odwrotnego, i potwierdzają to zarówno nasze doświadczenia, jak i badania rynku nieruchomości."
      ),
      ...tip(
        "Puste wnętrza wydają się mniejsze, nie większe",
        "Bez punktów odniesienia — mebli, których wielkość znamy — mózg gorzej ocenia proporcje pomieszczenia. Puste pokoje często wyglądają na mniejsze niż w rzeczywistości, nie większe."
      ),
      ...tip(
        "Trudniej wyobrazić sobie 'życie' w przestrzeni",
        "Większość kupujących nie jest projektantami wnętrz — potrzebuje zobaczyć, jak przestrzeń może funkcjonować, żeby to sobie wyobrazić. Puste ściany i podłogi zostawiają zbyt wiele do domysłu."
      ),
      ...tip(
        "Brak 'ciepła' wpływa na decyzję emocjonalną",
        "Decyzja o zakupie nieruchomości rzadko jest czysto racjonalna. Puste, echo niosące wnętrze rzadko wywołuje to samo poczucie 'mogę tu zamieszkać', co przestrzeń choćby minimalnie urządzona."
      ),
      ...tip(
        "Zdjęcia pustych wnętrz gorzej działają online",
        "Skoro większość pierwszego kontaktu z ofertą odbywa się przez zdjęcia w internecie, puste, nijakie kadry realnie zmniejszają liczbę osób, które w ogóle zdecydują się przyjść na oglądanie."
      ),
      paragraph(
        "Dlatego home staging traktujemy nie jako dodatek, a jako inwestycję, która realnie skraca czas sprzedaży — i to właśnie z tego powodu łączymy go zawsze z profesjonalną sesją zdjęciową."
      ),
    ],
  },
  {
    _id: "article-rekwizyty-zostaja-na-dluzej",
    title:
      "Nasze rekwizyty zostają na dłużej — jak dbamy o klimat pustego mieszkania podczas każdej prezentacji",
    slug: "rekwizyty-home-staging-zostaja-na-dluzej",
    category: "Home staging",
    metaTitle: "Home staging przy każdej prezentacji, nie tylko na zdjęciach | 4FF",
    metaDescription:
      "W praktycznie każdym przypadku, gdy przeprowadzamy home staging niezamieszkałej nieruchomości, nasze rekwizyty zostają na miejscu na dłużej niż sesja zdjęciowa.",
    excerpt:
      "Wiele agencji urządza wnętrze tylko na czas sesji zdjęciowej. My zostawiamy rekwizyty na miejscu, żeby każda osobista wizyta wyglądała tak samo dobrze jak zdjęcia.",
    publishedAt: daysAgo(4),
    body: [
      paragraph(
        "Home staging kojarzy się często wyłącznie z ładnymi zdjęciami do ogłoszenia — meble i dodatki na jeden dzień, żeby zrobić dobre ujęcia, a potem z powrotem puste, zimne wnętrze na każde kolejne oglądanie. My pracujemy inaczej."
      ),
      paragraph(
        "W praktycznie wszystkich przypadkach, w których przeprowadzamy home staging niezamieszkałej nieruchomości, nasze rekwizyty i dekoracje zostają na miejscu znacznie dłużej niż tylko na czas samej sesji zdjęciowej."
      ),
      ...tip(
        "Dlaczego to robimy",
        "Bo zdjęcia to dopiero pierwszy kontakt z ofertą — prawdziwa decyzja zapada podczas osobistej wizyty. Jeśli kupujący przyjeżdża zobaczyć mieszkanie, które na zdjęciach wyglądało ciepło i przytulnie, a na miejscu zastaje puste, echo niosące wnętrze, efekt pierwszego wrażenia z ogłoszenia się rozpada."
      ),
      ...tip(
        "Co to oznacza w praktyce",
        "Meble, tekstylia, dodatki dobrane pod konkretne wnętrze zostają w mieszkaniu przez cały okres aktywnej sprzedaży — nie tylko na czas sesji. Każda kolejna osoba, która przychodzi na oglądanie, widzi tę samą, przemyślaną atmosferę, co na zdjęciach w ogłoszeniu."
      ),
      ...tip(
        "Efekt dla sprzedającego",
        "Spójne wrażenie od pierwszego zdjęcia w internecie po ostatnią osobistą wizytę przed decyzją o zakupie. Mniej rozczarowań na miejscu, mniej pytań 'a czy to na pewno to samo mieszkanie co na zdjęciach' — i realnie krótszy czas sprzedaży."
      ),
      paragraph(
        "To jeden z tych detali, które trudno zauważyć z zewnątrz, a które w naszej praktyce najczęściej robią różnicę między jedną a kilkunastoma wizytami potrzebnymi do sprzedaży."
      ),
    ],
  },
  {
    _id: "article-kredyt-hipoteczny-bez-nerwow",
    title:
      "Kredyt hipoteczny bez nerwów: dlaczego postawiliśmy na współpracę z renomowanym, ogólnokrajowym partnerem?",
    slug: "kredyt-hipoteczny-bez-nerwow-partner-finansowy",
    category: "Finansowanie",
    metaTitle: "Kredyt hipoteczny bez nerwów — nasz partner finansowy | 4FF",
    metaDescription:
      "Formalności kredytowe bywają najbardziej stresującym etapem zakupu nieruchomości. Dowiedz się, dlaczego przy finansowaniu współpracujemy z Lendi.",
    excerpt:
      "Formalności kredytowe to często najbardziej stresujący etap zakupu nieruchomości. Oto dlaczego przy finansowaniu postawiliśmy na sprawdzonego, ogólnopolskiego partnera.",
    publishedAt: daysAgo(2),
    body: [
      paragraph(
        "Wiemy z doświadczenia, że formalności kredytowe potrafią być najbardziej stresującym etapem całego procesu zakupu nieruchomości — więcej dokumentów, więcej niewiadomych, więcej pytań bez jasnej odpowiedzi. Dlatego przy finansowaniu transakcji naszych klientów współpracujemy z Lendi — jednym z największych pośredników kredytu hipotecznego w Polsce."
      ),
      ...tip(
        "Skala i doświadczenie",
        "Lendi to obecnie największy pod względem liczby agentów pośrednik kredytu hipotecznego w Polsce — zespół ponad 1650 ekspertów kredytowych rozlokowanych w całym kraju. To realne doświadczenie w setkach różnych sytuacji finansowych, nie jednorazowa współpraca."
      ),
      ...tip(
        "Stabilne zaplecze",
        "Firma działa na rynku od 2010 roku i należy do grupy Morizon — jednego z największych serwisów nieruchomości w Polsce. To dla nas gwarancja, że współpracujemy z partnerem o ugruntowanej pozycji, a nie przypadkowym pośrednikiem."
      ),
      ...tip(
        "Zero dodatkowych kosztów dla klienta",
        "Korzystanie z usług pośrednika kredytowego jest całkowicie bezpłatne dla klienta — wynagrodzenie pośrednika pochodzi od banku, nie od Ciebie. Dostajesz profesjonalne porównanie ofert bez dodatkowej opłaty."
      ),
      ...tip(
        "Jedna oferta, wiele banków",
        "Zamiast samodzielnie odwiedzać kolejne oddziały banków, dostajesz porównanie realnie dostępnych ofert kredytowych dopasowanych do Twojej sytuacji — a przy okazji harmonogram, który spinamy z etapami transakcji nieruchomości."
      ),
      paragraph(
        "Dzięki tej współpracy formalności kredytowe przestają być czarną skrzynką — a stają się kolejnym, dobrze zaplanowanym krokiem w drodze do własnych czterech kątów."
      ),
    ],
  },
];

async function run() {
  for (const { _id, slug, ...rest } of articles) {
    console.log(`Seeding article: ${slug}...`);
    await client.createOrReplace({
      _id,
      _type: "article",
      slug: { _type: "slug", current: slug },
      ...rest,
    });
  }
  console.log("Done.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
