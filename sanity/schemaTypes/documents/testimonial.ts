import { defineField, defineType } from "sanity";

export const testimonial = defineType({
  name: "testimonial",
  title: "Opinia klienta",
  type: "document",
  fields: [
    defineField({ name: "quote", title: "Treść opinii", type: "text" }),
    defineField({
      name: "rating",
      title: "Ocena",
      type: "number",
      validation: (r) => r.min(1).max(5).integer(),
      initialValue: 5,
    }),
    defineField({ name: "clientSignature", title: "Podpis klienta", type: "string" }),
    defineField({ name: "location", title: "Lokalizacja", type: "string" }),
    defineField({
      name: "visibleOnHomepage",
      title: "Widoczna na stronie głównej",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: "clientSignature", subtitle: "quote" },
  },
});
