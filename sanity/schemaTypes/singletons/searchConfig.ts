import { defineField, defineType } from "sanity";

export const searchConfig = defineType({
  name: "searchConfig",
  title: "Wyszukiwarka nieruchomości",
  type: "document",
  fields: [
    defineField({ name: "locationLabel", title: 'Etykieta pola "Lokalizacja"', type: "string" }),
    defineField({
      name: "propertyTypeLabel",
      title: 'Etykieta pola "Typ nieruchomości"',
      type: "string",
    }),
    defineField({
      name: "propertyTypeOptions",
      title: "Opcje typu nieruchomości",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({ name: "priceLabel", title: 'Etykieta pola "Cena do"', type: "string" }),
    defineField({
      name: "priceThresholds",
      title: "Progi cenowe",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({ name: "submitButtonLabel", title: "Tekst przycisku", type: "string" }),
  ],
});
