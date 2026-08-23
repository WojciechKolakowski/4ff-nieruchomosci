import { defineField, defineType } from "sanity";

export const leadSubmission = defineType({
  name: "leadSubmission",
  title: "Zgłoszenie z formularza",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Imię i nazwisko", type: "string" }),
    defineField({ name: "phone", title: "Telefon", type: "string" }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({ name: "interest", title: "Czego dotyczy zapytanie", type: "string" }),
    defineField({
      name: "marketingConsent",
      title: "Zgoda marketingowa",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: { list: ["Nowe", "W toku", "Obsłużone"] },
      initialValue: "Nowe",
    }),
  ],
  orderings: [
    {
      title: "Najnowsze najpierw",
      name: "createdDesc",
      by: [{ field: "_createdAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "phone", status: "status" },
    prepare({ title, subtitle, status }) {
      return { title, subtitle: `${subtitle} — ${status}` };
    },
  },
});
