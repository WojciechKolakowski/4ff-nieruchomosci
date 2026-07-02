import type { StructureResolver } from "sanity/structure";
import { singletonTypeNames } from "./schemaTypes";

const singletonLabels: Record<string, string> = {
  globalSettings: "Ustawienia globalne",
  hero: "Sekcja Hero",
  searchConfig: "Wyszukiwarka nieruchomości",
  whyUs: 'Sekcja "Dlaczego my"',
  vipProgram: "Program 4FF VIP",
  footer: "Stopka",
  serviceArea: "Obszar działania",
};

export const structure: StructureResolver = (S) =>
  S.list()
    .title("4FF Nieruchomości")
    .items([
      ...singletonTypeNames.map((typeName) =>
        S.listItem()
          .title(singletonLabels[typeName] ?? typeName)
          .id(typeName)
          .child(S.document().schemaType(typeName).documentId(typeName))
      ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => !singletonTypeNames.includes(item.getId() ?? "")
      ),
    ]);
