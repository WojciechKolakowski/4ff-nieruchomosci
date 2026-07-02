import { defineField, defineType } from "sanity";

export const property = defineType({
  name: "property",
  title: "Nieruchomość",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Tytuł oferty", type: "string" }),
    defineField({
      name: "slug",
      title: "Adres URL (slug)",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: { list: ["draft", "vip", "public"] },
      initialValue: "draft",
    }),
    defineField({
      name: "unlockDate",
      title: "Data odblokowania",
      type: "datetime",
      description: 'Używane tylko gdy status = "vip" — data odblokowania publicznej widoczności.',
    }),
    defineField({ name: "price", title: "Cena", type: "number" }),
    defineField({
      name: "priceLabel",
      title: "Etykieta ceny (opcjonalna)",
      type: "string",
      description: 'np. "od 890 000 zł" lub "Cena na zapytanie" — nadpisuje wyświetlanie ceny.',
    }),
    defineField({
      name: "propertyType",
      title: "Typ nieruchomości",
      type: "string",
      options: { list: ["Dom", "Mieszkanie", "Działka", "Lokal", "Garaż"] },
    }),
    defineField({ name: "locationLabel", title: "Lokalizacja (tekst wyświetlany)", type: "string" }),
    defineField({
      name: "powiat",
      title: "Powiat",
      type: "reference",
      to: [{ type: "powiat" }],
    }),
    defineField({ name: "areaM2", title: "Metraż (m²)", type: "number" }),
    defineField({ name: "rooms", title: "Liczba pokoi", type: "number" }),
    defineField({ name: "plotSizeM2", title: "Wielkość działki (m²)", type: "number" }),
    defineField({
      name: "market",
      title: "Rynek",
      type: "string",
      options: { list: ["primary", "secondary"] },
    }),
    defineField({
      name: "highlightLabel",
      title: "Etykieta wyróżniająca",
      type: "string",
      description: 'np. "Nowość", "0% prowizji od kupującego".',
    }),
    defineField({
      name: "gallery",
      title: "Galeria zdjęć",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [{ name: "alt", title: "Tekst alternatywny", type: "string" }],
        },
      ],
    }),
    defineField({
      name: "metaItems",
      title: "Krótkie fakty (np. „4 pokoje”, „Działka 600 m²”)",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "description",
      title: "Opis pełny",
      type: "array",
      of: [{ type: "block" }],
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "status", media: "gallery.0" },
  },
});
