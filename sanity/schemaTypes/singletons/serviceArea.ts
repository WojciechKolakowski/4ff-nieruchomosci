import { defineField, defineType } from "sanity";

export const serviceArea = defineType({
  name: "serviceArea",
  title: "Obszar działania",
  type: "document",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({ name: "heading", title: "Nagłówek sekcji", type: "string" }),
    defineField({ name: "description", title: "Opis sekcji", type: "text" }),
  ],
});
