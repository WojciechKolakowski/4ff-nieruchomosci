import { defineField, defineType } from "sanity";

export const footer = defineType({
  name: "footer",
  title: "Stopka",
  type: "document",
  fields: [
    defineField({ name: "companyDescription", title: "Opis firmy (stopka)", type: "text" }),
    defineField({ name: "navLinks", title: "Linki nawigacji", type: "array", of: [{ type: "link" }] }),
    defineField({ name: "serviceLinks", title: "Linki usług", type: "array", of: [{ type: "link" }] }),
    defineField({
      name: "contactLines",
      title: "Linie kontaktowe",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({ name: "copyrightText", title: "Tekst copyright", type: "string" }),
    defineField({ name: "legalLinks", title: "Linki prawne", type: "array", of: [{ type: "link" }] }),
    defineField({ name: "cookieBannerText", title: "Tekst banera cookies", type: "text" }),
    defineField({ name: "cookieAcceptLabel", title: "Tekst przycisku akceptacji", type: "string" }),
    defineField({ name: "cookieRejectLabel", title: "Tekst przycisku odrzucenia", type: "string" }),
    defineField({
      name: "cookieCustomizeLabel",
      title: "Tekst przycisku „Dostosuj ustawienia” (w banerze)",
      type: "string",
    }),
    defineField({
      name: "cookieSettingsHeading",
      title: "Panel ustawień cookies — nagłówek",
      type: "string",
    }),
    defineField({
      name: "cookieSettingsLead",
      title: "Panel ustawień cookies — lead",
      type: "text",
    }),
    defineField({
      name: "cookieCategoryNecessaryLabel",
      title: "Kategoria „Niezbędne” — etykieta",
      type: "string",
    }),
    defineField({
      name: "cookieCategoryNecessaryDescription",
      title: "Kategoria „Niezbędne” — opis",
      type: "text",
    }),
    defineField({
      name: "cookieCategoryAnalyticsLabel",
      title: "Kategoria „Analityczne” — etykieta",
      type: "string",
    }),
    defineField({
      name: "cookieCategoryAnalyticsDescription",
      title: "Kategoria „Analityczne” — opis",
      type: "text",
    }),
    defineField({
      name: "cookieCategoryMarketingLabel",
      title: "Kategoria „Marketingowe” — etykieta",
      type: "string",
    }),
    defineField({
      name: "cookieCategoryMarketingDescription",
      title: "Kategoria „Marketingowe” — opis",
      type: "text",
    }),
    defineField({
      name: "cookieSaveLabel",
      title: "Tekst przycisku „Zapisz ustawienia”",
      type: "string",
    }),
  ],
});
