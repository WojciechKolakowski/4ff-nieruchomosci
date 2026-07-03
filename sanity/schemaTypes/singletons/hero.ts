import { defineField, defineType } from "sanity";

export const hero = defineType({
  name: "hero",
  title: "Sekcja Hero",
  type: "document",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({ name: "headlineBefore", title: "Nagłówek — część 1", type: "string" }),
    defineField({ name: "highlightedWord", title: "Wyróżnione słowo", type: "string" }),
    defineField({ name: "headlineAfter", title: "Nagłówek — część 2", type: "string" }),
    defineField({ name: "description", title: "Opis", type: "text" }),
    defineField({ name: "primaryButton", title: "Przycisk 1", type: "link" }),
    defineField({ name: "secondaryButton", title: "Przycisk 2", type: "link" }),
    defineField({
      name: "stats",
      title: "Statystyki",
      type: "array",
      of: [
        {
          type: "object",
          name: "stat",
          fields: [
            { name: "value", title: "Wartość", type: "string" },
            { name: "label", title: "Opis", type: "string" },
          ],
        },
      ],
    }),
    defineField({
      name: "slides",
      title: "Slajdy karuzeli",
      type: "array",
      of: [
        {
          type: "object",
          name: "heroSlide",
          fields: [
            {
              name: "type",
              title: "Typ slajdu",
              type: "string",
              options: { list: ["image", "video"] },
            },
            { name: "tag", title: "Etykieta", type: "string" },
            {
              name: "image",
              title: "Zdjęcie",
              type: "image",
              options: { hotspot: true },
              fields: [{ name: "alt", title: "Tekst alternatywny", type: "string" }],
            },
            {
              name: "video",
              title: "Wideo (plik mp4)",
              type: "file",
              description:
                "Krótki, skompresowany plik mp4 — odtwarza się automatycznie w tle, wyciszony, w pętli. Zalecane: kilka–kilkanaście MB, nie kilkaset.",
              options: { accept: "video/mp4" },
            },
            { name: "link", title: "Link docelowy", type: "url" },
          ],
        },
      ],
    }),
    defineField({
      name: "leadForm",
      title: "Formularz leadowy",
      type: "object",
      fields: [
        { name: "heading", title: "Nagłówek", type: "string" },
        { name: "subheading", title: "Podtytuł", type: "string" },
        { name: "nameLabel", title: "Etykieta pola: Imię i nazwisko", type: "string" },
        { name: "namePlaceholder", title: "Placeholder: Imię i nazwisko", type: "string" },
        { name: "phoneLabel", title: "Etykieta pola: Telefon", type: "string" },
        { name: "phonePlaceholder", title: "Placeholder: Telefon", type: "string" },
        { name: "interestLabel", title: "Etykieta pola: Czego szukasz?", type: "string" },
        {
          name: "interestOptions",
          title: "Opcje: Czego szukasz?",
          type: "array",
          of: [{ type: "string" }],
        },
        {
          name: "consentRequiredLabel",
          title: "Treść zgody wymaganej",
          type: "text",
        },
        {
          name: "consentMarketingLabel",
          title: "Treść zgody marketingowej",
          type: "text",
        },
        { name: "submitButtonLabel", title: "Tekst przycisku wysyłki", type: "string" },
        { name: "rodoNote", title: "Nota RODO", type: "text" },
      ],
    }),
  ],
});
