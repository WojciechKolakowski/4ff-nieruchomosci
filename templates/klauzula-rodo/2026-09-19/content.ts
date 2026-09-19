// Text of "Klauzula informacyjna RODO" — version 19.09.2026.
//
// This is a verbatim transcription of template.pdf in this directory. Do NOT
// edit, fix or paraphrase it: the archived PDF is built from the template
// itself, and tests/klauzula/template-parity.test.tsx fails if what the client
// sees on screen ever differs from what is in the PDF.

export type Run = { text: string; bold?: boolean; italic?: boolean };

export type Block =
  | { type: "heading"; text: string }
  | { type: "paragraph"; runs: Run[] }
  | { type: "bullets"; items: Run[][] }
  | { type: "table"; columns: [string, string, string]; rows: Run[][][] };

const t = (text: string): Run => ({ text });
const b = (text: string): Run => ({ text, bold: true });
const i = (text: string): Run => ({ text, italic: true });

export const letterhead: Run[] = [
  b("4FF Sp. z o.o."),
  t("ul. Warszawska 44/50 lok 139B, 95-200 Pabianice"),
  t("mail: biuro@4ffnieruchomosci.pl"),
  t("Tel: +48 505 644 440"),
  t("NIP: 7312079133"),
  t("REGON: 523822208"),
  t("KRS: 0001006042"),
];

export const title = "KLAUZULA INFORMACYJNA RODO";
export const subtitle = "o przetwarzaniu danych osobowych klientów";

export const clauseBlocks: Block[] = [
  { type: "paragraph", runs: [b("Szanowni Państwo,")] },
  {
    type: "paragraph",
    runs: [
      t(
        "zgodnie z art. 13 ust. 1 i 2 rozporządzenia Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. w sprawie ochrony osób fizycznych w związku z przetwarzaniem danych osobowych i w sprawie swobodnego przepływu takich danych oraz uchylenia dyrektywy 95/46/WE (ogólne rozporządzenie o ochronie danych, dalej: „"
      ),
      b("RODO"),
      t("”) informujemy, że:"),
    ],
  },

  { type: "heading", text: "1. Administrator danych osobowych" },
  {
    type: "paragraph",
    runs: [
      t("Administratorem Państwa danych osobowych jest "),
      b("4FF Sp. z o.o."),
      t(
        " z siedzibą w Pabianicach (95-200), ul. Warszawska 44/50 lok. 139B, wpisana do rejestru przedsiębiorców Krajowego Rejestru Sądowego pod numerem KRS 0001006042, NIP 7312079133, REGON 523822208 (dalej: „"
      ),
      b("Administrator"),
      t(
        "”). Z Administratorem mogą Państwo skontaktować się pod adresem e-mail: biuro@4ffnieruchomosci.pl, telefonicznie: +48 505 644 440 lub listownie na adres siedziby. Administrator nie wyznaczył Inspektora Ochrony Danych; we wszystkich sprawach dotyczących przetwarzania danych osobowych oraz realizacji Państwa praw prosimy o kontakt z Administratorem pod wskazanymi powyżej danymi."
      ),
    ],
  },

  { type: "heading", text: "2. Cele, podstawy prawne i okresy przetwarzania danych" },
  {
    type: "paragraph",
    runs: [
      t(
        "Państwa dane osobowe będą przetwarzane w następujących celach, na następujących podstawach prawnych i przez następujący okres (po jego upływie dane zostaną usunięte lub zanonimizowane, chyba że ich dalsze przechowywanie wynika z przepisów prawa):"
      ),
    ],
  },
  {
    type: "table",
    columns: ["Cel przetwarzania", "Podstawa prawna", "Okres przechowywania"],
    rows: [
      [
        [
          b("Zawarcie i wykonanie umowy"),
          t(
            ", w tym umowy pośrednictwa w obrocie nieruchomościami: podjęcie działań na Państwa żądanie przed zawarciem umowy, realizacja czynności pośrednictwa, kontakt z Państwem w związku z umową, obsługa administracyjna i rozliczenia."
          ),
        ],
        [
          t(
            "Art. 6 ust. 1 lit. b RODO (niezbędność do wykonania umowy lub do podjęcia działań przed jej zawarciem)."
          ),
        ],
        [
          t(
            "Przez czas trwania umowy; jeżeli umowa nie zostanie zawarta – do zakończenia kontaktu w sprawie jej zawarcia."
          ),
        ],
      ],
      [
        [
          b("Wypełnienie obowiązków prawnych"),
          t(
            " ciążących na Administratorze, w szczególności: obowiązków podatkowych i rachunkowych (wystawianie i przechowywanie faktur oraz dokumentów księgowych); obowiązków wynikających z ustawy z dnia 1 marca 2018 r. o przeciwdziałaniu praniu pieniędzy oraz finansowaniu terroryzmu (identyfikacja i weryfikacja klienta, stosowanie środków bezpieczeństwa finansowego); obowiązków wynikających z ustawy o gospodarce nieruchomościami."
          ),
        ],
        [t("Art. 6 ust. 1 lit. c RODO (obowiązek prawny).")],
        [
          t(
            "Przez okres wymagany przepisami: dokumenty podatkowe i księgowe – co do zasady 5 lat, licząc od końca roku kalendarzowego, w którym powstał obowiązek podatkowy; dokumentacja AML – 5 lat od dnia zakończenia stosunków gospodarczych z klientem lub od dnia przeprowadzenia transakcji okazjonalnej."
          ),
        ],
      ],
      [
        [
          b("Ustalenie, dochodzenie i obrona roszczeń"),
          t(" związanych z umową oraz "),
          b("zapewnienie bezpieczeństwa"),
          t(" klientów Administratora i innych osób w związku ze świadczonymi usługami."),
        ],
        [
          t(
            "Art. 6 ust. 1 lit. f RODO (prawnie uzasadniony interes Administratora: ochrona jego praw, możliwość wykazania należytego wykonania umowy oraz bezpieczeństwo osób)."
          ),
        ],
        [
          t(
            "Do upływu terminów przedawnienia roszczeń wynikających z umowy (co do zasady 3 lata dla roszczeń związanych z prowadzeniem działalności gospodarczej i 6 lat dla pozostałych; termin kończy się z końcem roku kalendarzowego) lub do prawomocnego zakończenia postępowań; w zakresie bezpieczeństwa – przez czas niezbędny do realizacji tego celu albo do skutecznego sprzeciwu."
          ),
        ],
      ],
      [
        [
          b("Marketing bezpośredni"),
          t(
            " usług Administratora (przedstawianie ofert) za pomocą wybranych przez Państwa kanałów kontaktu: telefonu, SMS/MMS lub poczty elektronicznej."
          ),
        ],
        [
          t(
            "Art. 6 ust. 1 lit. a RODO (zgoda) w związku z art. 398 ustawy z dnia 12 lipca 2024 r. Prawo komunikacji elektronicznej."
          ),
        ],
        [
          t(
            "Do czasu cofnięcia zgody. Dokumentację udzielenia i cofnięcia zgody przechowujemy do upływu terminów przedawnienia roszczeń (art. 6 ust. 1 lit. f RODO)."
          ),
        ],
      ],
    ],
  },

  { type: "heading", text: "3. Dobrowolność podania danych i skutki ich niepodania" },
  {
    type: "paragraph",
    runs: [
      t(
        "Podanie danych osobowych jest dobrowolne, ale w zakresie niezbędnym do zawarcia i wykonania umowy oraz wystawienia faktury stanowi warunek zawarcia i realizacji umowy – ich niepodanie uniemożliwi zawarcie lub wykonanie umowy. W zakresie, w jakim obowiązek podania danych wynika z przepisów prawa (m.in. ustawy o przeciwdziałaniu praniu pieniędzy oraz finansowaniu terroryzmu, przepisów podatkowych), ich podanie jest obowiązkowe; w razie odmowy Administrator może być zobowiązany do odmowy nawiązania stosunków gospodarczych lub przeprowadzenia transakcji. Podanie danych oraz wyrażenie zgody w celach marketingowych jest całkowicie dobrowolne i nie ma wpływu na możliwość zawarcia ani wykonania umowy."
      ),
    ],
  },

  { type: "heading", text: "4. Odbiorcy danych" },
  { type: "paragraph", runs: [t("Państwa dane osobowe mogą być udostępniane:")] },
  {
    type: "bullets",
    items: [
      [
        t(
          "podmiotom przetwarzającym dane na zlecenie Administratora (na podstawie umów powierzenia, art. 28 RODO), w szczególności dostawcom usług i oprogramowania informatycznego, poczty elektronicznej, chmury i hostingu (m.in. Google w zakresie Google Workspace oraz Microsoft), biuru rachunkowemu, dostawcom usług telekomunikacyjnych i pocztowych; w zakresie, w jakim Administrator korzysta z usług Meta, dane mogą być przekazywane również tej firmie – przy czym w razie kontaktu z Administratorem za pośrednictwem usług Meta platforma ta przetwarza dane także jako odrębny administrator, na zasadach określonych w jej regulaminie i polityce prywatności;"
        ),
      ],
      [
        t(
          "podmiotom i organom uprawnionym na podstawie przepisów prawa, np. organom podatkowym, sądom, organom ścigania, Generalnemu Inspektorowi Informacji Finansowej;"
        ),
      ],
      [
        t(
          "podmiotom, którym przekazanie danych jest niezbędne do wykonania umowy lub realizacji Państwa zlecenia, np. notariuszom, współpracującym biurom nieruchomości, bankom i brokerom finansowym, rzeczoznawcom majątkowym, kancelariom prawnym, a także drugiej stronie transakcji i jej pełnomocnikom;"
        ),
      ],
      [t("upoważnionym pracownikom i współpracownikom Administratora.")],
    ],
  },

  { type: "heading", text: "5. Źródło danych" },
  {
    type: "paragraph",
    runs: [
      t(
        "Dane osobowe zbieramy co do zasady bezpośrednio od Państwa. Jeżeli pozyskamy je z innego źródła (np. od drugiej strony transakcji), przekażemy Państwu odrębną informację zgodnie z art. 14 RODO."
      ),
    ],
  },

  { type: "heading", text: "6. Państwa prawa" },
  {
    type: "paragraph",
    runs: [
      t(
        "Przysługuje Państwu prawo: dostępu do swoich danych osobowych (art. 15 RODO), ich sprostowania (art. 16), usunięcia (art. 17), ograniczenia przetwarzania (art. 18) oraz przenoszenia danych (art. 20) – w zakresie i na warunkach określonych w RODO. Jeżeli przetwarzanie odbywa się na podstawie zgody, mają Państwo prawo "
      ),
      b("cofnąć zgodę w dowolnym momencie"),
      t(
        " (np. wysyłając wiadomość na adres biuro@4ffnieruchomosci.pl); cofnięcie zgody nie wpływa na zgodność z prawem przetwarzania, którego dokonano na jej podstawie przed jej cofnięciem. Przysługuje Państwu również prawo wniesienia skargi do organu nadzorczego – Prezesa Urzędu Ochrony Danych Osobowych, ul. Stawki 2, 00-193 Warszawa."
      ),
    ],
  },

  { type: "heading", text: "7. Prawo sprzeciwu" },
  {
    type: "paragraph",
    runs: [
      b(
        "Mają Państwo prawo w dowolnym momencie wnieść sprzeciw wobec przetwarzania swoich danych osobowych opartego na art. 6 ust. 1 lit. f RODO (prawnie uzasadniony interes Administratora), z przyczyn związanych z Państwa szczególną sytuacją."
      ),
      t(
        " W takim przypadku Administrator przestanie przetwarzać dane w tych celach, chyba że wykaże istnienie ważnych prawnie uzasadnionych podstaw do ich dalszego przetwarzania, nadrzędnych wobec Państwa interesów, praw i wolności, lub podstaw do ustalenia, dochodzenia lub obrony roszczeń."
      ),
    ],
  },

  { type: "heading", text: "8. Zautomatyzowane podejmowanie decyzji" },
  {
    type: "paragraph",
    runs: [
      t(
        "Państwa dane osobowe nie będą podlegały decyzjom opartym wyłącznie na zautomatyzowanym przetwarzaniu, w tym profilowaniu, o których mowa w art. 22 ust. 1 i 4 RODO."
      ),
    ],
  },

  { type: "heading", text: "9. Przekazywanie danych poza Europejski Obszar Gospodarczy" },
  {
    type: "paragraph",
    runs: [
      t(
        "Administrator korzysta z usług dostawców należących do grup kapitałowych z siedzibą w Stanach Zjednoczonych: Google (Google Workspace), Microsoft oraz Meta. W związku z tym Państwa dane osobowe mogą być przekazywane do państwa trzeciego – Stanów Zjednoczonych. Przekazanie następuje na podstawie decyzji wykonawczej Komisji Europejskiej (UE) 2023/1795 z dnia 10 lipca 2023 r. stwierdzającej odpowiedni stopień ochrony danych osobowych w ramach Ramowego programu ochrony danych UE–USA (EU-US Data Privacy Framework) – w odniesieniu do dostawców uczestniczących w tym programie – a także na podstawie standardowych klauzul umownych zatwierdzonych przez Komisję Europejską (art. 46 ust. 2 lit. c RODO), stosowanych w umowach z dostawcami, w szczególności na wypadek ustania obowiązywania tej decyzji. Kopię zastosowanych zabezpieczeń mogą Państwo uzyskać, kontaktując się z Administratorem (dane kontaktowe w pkt 1)."
      ),
    ],
  },
];

export const acknowledgement =
  "Potwierdzam, że zapoznałem/zapoznałam się z treścią powyższej klauzuli informacyjnej.";

/** Printed under every signature line (page 2 and page 3). */
export const signatureCaption = "(data i czytelny podpis)";

export type ChannelId = "phone" | "sms" | "email";

export const consent = {
  title: "ZGODA NA KONTAKT MARKETINGOWY",
  subtitle: "(dobrowolna – można ją wyrazić w całości, w wybranym zakresie albo wcale)",
  intro:
    "Niewyrażenie zgody nie wpływa na możliwość zawarcia ani wykonania umowy oraz na jakość obsługi. Zgodę mogą Państwo cofnąć w dowolnym momencie w sposób równie prosty, jak została udzielona – np. e-mailem na adres biuro@4ffnieruchomosci.pl – co nie wpływa na zgodność z prawem przetwarzania dokonanego przed jej cofnięciem.",
  statement: [
    t(
      "Wyrażam zgodę na przetwarzanie moich danych osobowych (imię i nazwisko, numer telefonu, adres e-mail) przez 4FF Sp. z o.o. w celu przedstawiania mi ofert usług Administratora związanych z pośrednictwem w obrocie nieruchomościami (marketing bezpośredni) oraz na kontakt w tym celu za pośrednictwem następujących kanałów "
    ),
    i("(proszę zaznaczyć wybrane)"),
    t(":"),
  ] as Run[],
  channels: [
    { id: "phone", label: "rozmowa telefoniczna" },
    { id: "sms", label: "wiadomość SMS / MMS" },
    { id: "email", label: "poczta elektroniczna (e-mail)" },
  ] as { id: ChannelId; label: string }[],
  nameLabel: "Imię i nazwisko:",
};
