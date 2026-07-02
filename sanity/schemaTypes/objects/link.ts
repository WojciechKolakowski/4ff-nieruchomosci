import { defineField, defineType } from "sanity";

export const link = defineType({
  name: "link",
  title: "Link",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Etykieta", type: "string" }),
    defineField({ name: "href", title: "Adres", type: "string" }),
  ],
});
