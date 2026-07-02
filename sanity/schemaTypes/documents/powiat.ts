import { defineField, defineType } from "sanity";

export const powiat = defineType({
  name: "powiat",
  title: "Powiat",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Nazwa powiatu", type: "string" }),
    defineField({
      name: "voivodeship",
      title: "Województwo",
      type: "string",
      options: { list: ["łódzkie", "lubelskie"] },
    }),
    defineField({ name: "order", title: "Kolejność wyświetlania", type: "number" }),
  ],
  orderings: [
    {
      title: "Kolejność wyświetlania",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "voivodeship" },
  },
});
