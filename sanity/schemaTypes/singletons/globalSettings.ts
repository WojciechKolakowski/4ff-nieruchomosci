import { defineField, defineType } from "sanity";

export const globalSettings = defineType({
  name: "globalSettings",
  title: "Ustawienia globalne",
  type: "document",
  fields: [
    defineField({
      name: "logoLight",
      title: "Logo (wersja jasna)",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", title: "Tekst alternatywny", type: "string" }],
    }),
    defineField({
      name: "logoDark",
      title: "Logo (wersja ciemna)",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", title: "Tekst alternatywny", type: "string" }],
    }),
    defineField({ name: "phone", title: "Telefon", type: "string" }),
    defineField({ name: "email", title: "E-mail", type: "string", validation: (r) => r.email() }),
    defineField({ name: "officeAddress", title: "Adres biura", type: "string" }),
    defineField({
      name: "socialLinks",
      title: "Social media",
      type: "object",
      fields: [
        { name: "facebook", title: "Facebook", type: "url" },
        { name: "instagram", title: "Instagram", type: "url" },
        { name: "youtube", title: "YouTube", type: "url" },
      ],
    }),
    defineField({
      name: "ctaValuationButtonLabel",
      title: 'Tekst przycisku „Bezpłatna wycena"',
      type: "string",
    }),
    defineField({
      name: "loginButtonLabel",
      title: 'Tekst przycisku „Zaloguj się"',
      type: "string",
    }),
    defineField({
      name: "navLinks",
      title: "Linki nawigacji głównej",
      type: "array",
      of: [{ type: "link" }],
    }),
    defineField({
      name: "trustBarItems",
      title: "Pasek zaufania",
      type: "array",
      of: [
        {
          type: "object",
          name: "trustBarItem",
          fields: [
            { name: "icon", title: "Ikona", type: "string" },
            { name: "before", title: "Tekst przed", type: "string" },
            { name: "strong", title: "Tekst wyróżniony", type: "string" },
            { name: "after", title: "Tekst po", type: "string" },
          ],
          preview: {
            select: { icon: "icon", before: "before", strong: "strong", after: "after" },
            prepare({ icon, before, strong, after }) {
              return {
                title: [before, strong, after].filter(Boolean).join("") || "Pozycja paska zaufania",
                subtitle: icon,
              };
            },
          },
        },
      ],
    }),
  ],
});
