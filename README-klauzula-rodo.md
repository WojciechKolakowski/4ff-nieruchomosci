# Klauzula RODO – wewnętrzna podstrona `/klauzula-rodo`

Pracownik biura otwiera klientowi klauzulę informacyjną RODO, klient wpisuje dane i składa
odręczny podpis (palcem, rysikiem, myszą lub touchpadem). System buduje z zatwierdzonego
szablonu 3‑stronicowy PDF i zapisuje go na Dysku Google firmy.

**Obowiązująca wersja:** `wersja z 19.09.2026` (`templates/klauzula-rodo/2026-09-19/`).

## Jak to działa

```
przeglądarka (kreator, 4 kroki)                       serwer (Vercel, route handlers)
──────────────────────────────                        ───────────────────────────────
hasło ───────────────────────────────► /api/klauzula-rodo/login   → ciasteczko sesji (12 h)
podpis potwierdzony ("Dalej") ───────► /api/klauzula-rodo/stamp   → czas z serwera + podpis HMAC
"Zatwierdź i zapisz" ────────────────► /api/klauzula-rodo/save    → walidacja → PDF z szablonu → Dysk Google
```

* **Treść dokumentu jest nienaruszalna.** PDF powstaje przez nałożenie danych na `template.pdf`
  (pdf-lib), nie przez ponowny skład. Tekst na ekranie jest identyczny z szablonem – pilnuje tego
  test `tests/klauzula/template-parity.test.tsx`.
* **Data i godzina** każdego podpisu pochodzą z serwera (Europe/Warsaw). Przeglądarka dostaje
  znacznik podpisany HMAC, związany z sesją, numerem podpisu i skrótem obrazu; serwer weryfikuje
  go przy zapisie (ważny 3 h). Nic nie jest przechowywane.
* **Brak przechowywania danych klientów** na serwerze i w przeglądarce (tylko pamięć RAM strony).
  PDF przechodzi przez pamięć funkcji i trafia na Dysk. Logi nie zawierają danych osobowych.
* Strona **nie jest indeksowana** (meta + nagłówek `X-Robots-Tag`), nie ma jej w sitemapie, działa
  poza layoutem `(site)` – bez Meta Pixela i paska cookies.

## Zmienne środowiskowe

Wzór: `.env.local.example`. Lokalnie: `.env.local` (poza gitem). Na Vercelu: *Settings → Environment Variables*.

| Zmienna | Opis |
|---|---|
| `KLAUZULA_PASSWORD_HASH` | skrót scrypt hasła biura (`npm run klauzula:hash`) |
| `KLAUZULA_SESSION_SECRET` | ≥ 32 losowe znaki; podpisuje sesję i znaczniki (`npm run klauzula:hash -- --secret`) |
| `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET` | klient OAuth typu „Aplikacja komputerowa” |
| `GOOGLE_OAUTH_REFRESH_TOKEN` | token odświeżania konta firmowego (skrypt `klauzula:google`) |
| `KLAUZULA_DRIVE_FOLDER_ID_TEST` | ID folderu **testowego** na Dysku |
| `KLAUZULA_DRIVE_FOLDER_ID` | ID folderu **produkcyjnego** „Klauzule RODO” |
| `KLAUZULA_DRIVE_TARGET` | `test` (domyślnie) albo `prod`. **Zapis idzie do produkcji tylko przy `prod`.** |

> Hash hasła ma format `scrypt:N:r:p:sól:hash` (bez znaku `$`, który dotenv/Vercel traktują jako zmienną).

## Pierwsze uruchomienie lokalnie

```bash
npm run klauzula:hash            # podaj hasło (min. 12 znaków) → wklej KLAUZULA_PASSWORD_HASH do .env.local
npm run klauzula:hash -- --secret  # → wklej KLAUZULA_SESSION_SECRET
npm run dev                      # http://localhost:3000/klauzula-rodo
```

Bez konfiguracji Google kreator działa aż do zapisu; zapis zwróci komunikat o błędzie Dysku.

## Konfiguracja Google (jednorazowo, ok. 15 min)

Właścicielem archiwum będzie **jedno konto Google firmy** (np. `biuro@4ffnieruchomosci.pl` założone
jako konto Google, albo konto Workspace). Dane klientów trafiają na jego Dysk, więc użyj konta
firmowego, nie prywatnego. (Klauzula w pkt 4 i 9 wymienia Google jako podmiot przetwarzający –
warto, by umowa/warunki powierzenia obejmowały to konto.)

1. Wejdź na <https://console.cloud.google.com/> zalogowany tym kontem → **Nowy projekt** (np. „4FF Klauzule RODO”).
2. **API i usługi → Biblioteka** → włącz **Google Drive API**.
3. **API i usługi → Ekran zgody OAuth** (Google Auth platform):
   * typ użytkowników: **Zewnętrzny** (albo **Wewnętrzny**, jeśli konto należy do organizacji Workspace),
   * nazwa aplikacji „4FF Klauzule RODO”, e‑mail pomocy technicznej i kontaktowy dewelopera,
   * **zakresy:** dodaj tylko `https://www.googleapis.com/auth/drive.file` (najwęższy, wystarcza),
   * **Publikacja:** ustaw status **W produkcji** (*In production*). Przy statusie „Testowanie” token
     odświeżania wygasa po **7 dniach** i zapis przestanie działać. Dla zakresu `drive.file` zwykle
     nie jest wymagana weryfikacja aplikacji przez Google.
4. **Dane logowania → Utwórz dane logowania → Identyfikator klienta OAuth** → typ **Aplikacja komputerowa**.
   Skopiuj *Client ID* i *Client secret* do `.env.local` (`GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`).
5. Uruchom skrypt autoryzacji (otworzy adres logowania Google, nasłuchuje na `127.0.0.1:53682`):
   ```bash
   npm run klauzula:google -- --create-folders
   ```
   Zaloguj się kontem firmowym i zaakceptuj. Skrypt wypisze `GOOGLE_OAUTH_REFRESH_TOKEN` oraz utworzy dwa
   foldery w *Moim dysku*: **Klauzule RODO (TEST)** i **Klauzule RODO** – wypisze ich ID
   (`KLAUZULA_DRIVE_FOLDER_ID_TEST`, `KLAUZULA_DRIVE_FOLDER_ID`). Niczego nie zapisuje na dysku – wklej wartości sam.
6. Wpisz wszystkie zmienne w Vercel (dla środowisk *Production* i *Preview*), zostaw `KLAUZULA_DRIVE_TARGET=test`, zrób *Redeploy*.
7. W Dysku Google **udostępnij** foldery tym, którzy mają przeglądać archiwum (ustawienie „Ograniczony”,
   konkretne osoby). **Nie włączaj udostępniania „każdy, kto ma link”** – to dane klientów i podpisy.

**Dlaczego skrypt sam tworzy foldery?** Zakres `drive.file` pozwala aplikacji widzieć wyłącznie
foldery i pliki, które sama utworzyła; nie zobaczy folderu założonego ręcznie w Dysku. To świadomy wybór
(minimalne uprawnienia: wyciek tokenu nie otwiera całego Dysku). Jeśli koniecznie chcesz użyć folderu
założonego ręcznie, uruchom skrypt z `--full-drive` (zakres `drive` – **pełny dostęp do całego Dysku tego konta**)
i wpisz ID tego folderu w zmiennej środowiskowej. Możesz też przenieść w Dysku folder utworzony przez skrypt
w dowolne miejsce – aplikacja nadal ma do niego dostęp.

**Cofnięcie dostępu:** <https://myaccount.google.com/permissions> → usuń aplikację „4FF Klauzule RODO”.

## Struktura na Dysku

```
Klauzule RODO/
└── Imię Nazwisko/
    └── Klauzula RODO - Imię Nazwisko - RRRR-MM-DD_GGMM.pdf
```

* Podfolder klienta jest używany ponownie, jeśli już istnieje (bez duplikatów).
* Ponowne podpisanie tworzy **nowy plik** – nic nie jest nadpisywane.
* Opis pliku na Dysku: wersja klauzuli i „Zgoda marketingowa: tak/nie” (bez danych osobowych).
* Nazwy są sanityzowane (Unicode NFC, niedozwolone znaki, limit długości); zapytania do Drive są escapowane
  (nazwiska z apostrofem, np. O'Brien, działają).

## Zmiana hasła

```bash
npm run klauzula:hash            # nowe hasło → nowa wartość KLAUZULA_PASSWORD_HASH
```

Podmień `KLAUZULA_PASSWORD_HASH` na Vercelu i zrób *Redeploy*. Aby **natychmiast** unieważnić wszystkie
otwarte sesje (sesja jest bezstanowa i ważna 12 h), zmień też `KLAUZULA_SESSION_SECRET`.

## Wgranie nowej wersji klauzuli

Stare wersje zostają w repozytorium. Dla nowej klauzuli:

1. Skopiuj katalog `templates/klauzula-rodo/2026-09-19/` do `templates/klauzula-rodo/RRRR-MM-DD/`.
2. Podmień `template.pdf` na zatwierdzony plik (3 strony A4; stopka z oznaczeniem wersji).
3. `content.ts` – przepisz treść **dosłownie** z nowego PDF (struktura jak w poprzedniej wersji).
4. `coords.ts` – zmierz położenie pól (linie podpisu, pola wyboru, wolne miejsca), np. pdf.js
   (`getOperatorList` dla linii/kwadratów, `getTextContent` dla tekstu).
5. `index.ts` – ustaw `id`, `label` (dokładnie jak w stopce PDF) i `pdfTitle`.
6. Zarejestruj wersję w `templates/klauzula-rodo/index.ts` (`VERSIONS` i `CURRENT_VERSION`).
7. `npm test` – test zgodności tekstu wskaże każdą różnicę między widokiem a PDF. Wygeneruj próbki
   i obejrzyj je (renderuj do PNG i sprawdź układ):
   ```bash
   KLAUZULA_SAMPLE_DIR=./tmp-probki npx vitest run tests/klauzula/pdf.test.ts
   ```
8. Klient, który ma otwartą starą wersję w chwili wdrożenia, dostanie komunikat „Wersja klauzuli została
   zaktualizowana” i odświeży stronę (serwer porównuje `versionId`).

## Limit prób (Vercel Firewall)

Instancje serverless nie współdzielą pamięci, więc limit w kodzie jest tylko dodatkiem (opóźnienie po błędnym
haśle + licznik w pamięci instancji). **Właściwy limit ustaw w Vercel:**

*Projekt → Security → Firewall → Configure → Add rule* (nazwy opcji mogą się nieco różnić zależnie od planu):

* **If:** *Request Path* → *Starts with* → `/api/klauzula-rodo`
* **Then:** *Rate Limit* → np. **20 żądań / 1 minutę** na adres IP (klucz: IP), po przekroczeniu *Deny* (429)
* zapisz i opublikuj regułę (*Publish*).

Wszystkie trasy API są pod jednym prefiksem, więc wystarczy jedna reguła (ważne, jeśli plan ma limit liczby reguł).
Dostępność i limity reguł zależą od planu Vercel.

## Testy

```bash
npm test          # vitest: zgodność tekstu, PDF, walidacja, sesja, Dysk (mock), pełny przepływ zapisu
npx tsc --noEmit && npm run lint
```

Testy automatyczne obejmują m.in.: zgodność tekstu widoku z szablonem; PDF w obu scenariuszach
(bez zgody / zgoda na wszystkie kanały), polskie znaki, długie dane, nienaruszalność tekstu szablonu,
brak pól formularza; walidację (telefon warunkowy, +48), sanityzację i escapowanie nazw; wybór/tworzenie
folderu i brak nadpisywania (mock Drive API); sesję, znaczniki podpisów i ochronę przed podrobieniem.

## Lista testów ręcznych

Przed przełączeniem na produkcję, dla obu wariantów (**A:** tylko potwierdzenie klauzuli, **B:** potwierdzenie + zgoda
na wybrane kanały z drugim podpisem):

| Urządzenie / wejście | A | B |
|---|:-:|:-:|
| Chrome, komputer – mysz | ☐ | ☐ |
| Chrome, komputer – touchpad | ☐ | ☐ |
| Safari, iPad – palec | ☐ | ☐ |
| Safari, iPad – Apple Pencil | ☐ | ☐ |
| Safari, iPhone – palec (pion i poziom) | ☐ | ☐ |
| Chrome, Android (telefon/tablet) – palec | ☐ | ☐ |
| Rysik na tablecie z Androidem / Windows | ☐ | ☐ |

Dla każdej kombinacji sprawdź:

1. Logowanie błędnym i poprawnym hasłem; wylogowanie; brak dostępu do `/klauzula-rodo` po wylogowaniu.
2. Podpis nie przewija strony; obrót ekranu w trakcie kroku nie kasuje podpisu; „Wyczyść podpis” działa.
3. Cofanie się między krokami nie kasuje danych i podpisów; zmiana podpisu wymaga ponownego „Dalej”.
4. Krok 3: kanały odznaczone domyślnie; „Pomiń” działa; zaznaczenie kanału pokazuje telefon i podpis; odznaczenie
   wszystkich ukrywa je i czyści dane; telefon wymagany tylko dla rozmowy/SMS.
5. „Zatwierdź i zapisz”: blokada podwójnego kliknięcia, komunikat błędu po polsku (np. wyłącz sieć), ponowienie bez utraty danych.
6. PDF na Dysku: 3 strony, treść identyczna z szablonem, znaczniki X/podpisy/dane w wolnych miejscach, polskie znaki,
   długie imię i nazwisko mieści się w polu, nazwa pliku i folderu poprawne, podpisanie tej samej osoby drugi raz = nowy plik w tym samym folderze.
7. „Nowy klient” czyści formularz; po odświeżeniu strony żadne dane klienta nie zostają w przeglądarce.

## Przełączenie na folder produkcyjny

1. Zapisy próbne idą do folderu **TEST** (`KLAUZULA_DRIVE_TARGET=test`). Obejrzyj kilka PDF-ów na Dysku.
2. Po akceptacji ustaw na Vercelu `KLAUZULA_DRIVE_TARGET=prod` (i `KLAUZULA_DRIVE_FOLDER_ID`), *Redeploy*.
3. Wykonaj jeden zapis kontrolny i sprawdź, że plik trafił do „Klauzule RODO”.

## Bezpieczeństwo – założenia i ograniczenia

* Hasło sprawdzane wyłącznie po stronie serwera (scrypt, `timingSafeEqual`); sesja: podpisane ciasteczko
  `httpOnly`, `Secure` (produkcja), `SameSite=Strict`, 12 h. Wylogowanie czyści ciasteczko po stronie przeglądarki;
  wcześniej wydanego ciasteczka nie da się unieważnić przed upływem 12 h inaczej niż zmianą `KLAUZULA_SESSION_SECRET`.
* Wszystkie endpointy zapisu wymagają ważnej sesji, sprawdzają `Origin` (CSRF), limit rozmiaru żądania i walidują dane po stronie serwera.
* Nagłówki: `X-Robots-Tag`, `Cache-Control: no-store`, `Referrer-Policy: no-referrer`, `X-Frame-Options: DENY`,
  CSP z nonce (`proxy.ts`), `Permissions-Policy`.
* Jedno wspólne hasło dla pracowników (bez kont indywidualnych).
* Poza zakresem: wysyłka kopii klientowi, cofanie zgody, panel przeglądania archiwum.

## Rozwiązywanie problemów

| Objaw | Przyczyna / co zrobić |
|---|---|
| „Strona nie jest jeszcze skonfigurowana” przy logowaniu | brak `KLAUZULA_PASSWORD_HASH` lub `KLAUZULA_SESSION_SECRET` (≥ 32 znaków) |
| „Nieprawidłowe hasło” mimo poprawnego | hash wklejony z uciętym końcem lub ze zmienioną wartością; wygeneruj ponownie |
| Zapis: „Nie udało się zapisać na Dysku” | brak/zły token lub ID folderu; w logach Vercel: `klauzula-rodo: Drive save failed` + komunikat (bez danych klienta) |
| Po tygodniu zapis przestał działać | aplikacja OAuth w statusie „Testowanie” – ustaw „W produkcji” i wygeneruj token ponownie |
| Podpis „wygasł lub został zmieniony” | od zatwierdzenia podpisu minęły > 3 h, albo zmieniono rysunek – wróć i kliknij „Dalej” ponownie |
| 429 przy logowaniu | zbyt wiele prób; poczekaj lub sprawdź regułę Firewall |
