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
  ],
});
