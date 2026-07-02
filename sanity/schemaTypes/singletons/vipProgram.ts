import { defineField, defineType } from "sanity";

export const vipProgram = defineType({
  name: "vipProgram",
  title: "Program 4FF VIP",
  type: "document",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({ name: "heading", title: "Nagłówek", type: "string" }),
    defineField({ name: "description", title: "Opis", type: "text" }),
    defineField({
      name: "steps",
      title: "Kroki programu",
      type: "array",
      of: [
        {
          type: "object",
          name: "vipStep",
          fields: [
            { name: "number", title: "Numer", type: "string" },
            { name: "description", title: "Opis", type: "text" },
          ],
        },
      ],
    }),
    defineField({ name: "ctaButtonLabel", title: "Tekst przycisku CTA", type: "string" }),
  ],
});
