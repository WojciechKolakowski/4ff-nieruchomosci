import { defineField, defineType } from "sanity";

export const article = defineType({
  name: "article",
  title: "Artykuł (Poradnik)",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Tytuł", type: "string" }),
    defineField({
      name: "slug",
      title: "Adres URL (slug)",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: "metaTitle", title: "Meta title", type: "string" }),
    defineField({ name: "metaDescription", title: "Meta description", type: "text" }),
    defineField({
      name: "category",
      title: "Kategoria",
      type: "string",
      options: { list: ["Sprzedaż", "Zakup", "Home staging", "Finansowanie"] },
    }),
    defineField({ name: "excerpt", title: "Zajawka (do listy artykułów)", type: "text" }),
    defineField({
      name: "coverImage",
      title: "Zdjęcie okładkowe (opcjonalnie)",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "publishedAt", title: "Data publikacji", type: "datetime" }),
    defineField({
      name: "body",
      title: "Treść",
      type: "array",
      of: [{ type: "block" }],
    }),
  ],
  orderings: [
    {
      title: "Data publikacji (najnowsze)",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "category", media: "coverImage" },
  },
});
