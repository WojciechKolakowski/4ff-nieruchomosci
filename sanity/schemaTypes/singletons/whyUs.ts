import { defineField, defineType } from "sanity";

export const whyUs = defineType({
  name: "whyUs",
  title: 'Sekcja "Dlaczego my"',
  type: "document",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({ name: "heading", title: "Nagłówek sekcji", type: "string" }),
    defineField({ name: "description", title: "Opis sekcji", type: "text" }),
    defineField({
      name: "cards",
      title: "Karty przewag",
      type: "array",
      of: [
        {
          type: "object",
          name: "whyUsCard",
          fields: [
            { name: "label", title: "Etykieta", type: "string" },
            { name: "title", title: "Tytuł", type: "string" },
            { name: "description", title: "Opis", type: "text" },
          ],
        },
      ],
    }),
  ],
});
