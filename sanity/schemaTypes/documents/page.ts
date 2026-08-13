import { defineField, defineType } from "sanity";

export const page = defineType({
  name: "page",
  title: "Strona treściowa",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Nazwa (do listy w Studio)", type: "string" }),
    defineField({
      name: "slug",
      title: "Adres URL (slug)",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: "metaTitle", title: "Meta title", type: "string" }),
    defineField({ name: "metaDescription", title: "Meta description", type: "text" }),
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({ name: "heading", title: "Nagłówek H1", type: "string" }),
    defineField({ name: "lead", title: "Lead", type: "text" }),
    defineField({
      name: "body",
      title: "Treść główna",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({ name: "ctaLabel", title: "Tekst przycisku CTA (opcjonalnie)", type: "string" }),
    defineField({ name: "ctaHref", title: "Link przycisku CTA (opcjonalnie)", type: "string" }),
  ],
  preview: {
    select: { title: "title", subtitle: "slug.current" },
  },
});
