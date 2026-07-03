import { getPropertyListing } from "@/content/property-listing";
import { getSearchConfigBase } from "@/content/search-config";
import { getPowiatyList } from "@/content/powiaty";
import { SearchBar } from "@/components/home/SearchBar";
import { PropertyCard } from "@/components/property/PropertyCard";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

function firstString(value: string | string[] | undefined): string {
  return typeof value === "string" ? value : "";
}

export default async function NieruchomosciPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const powiat = firstString(sp.powiat);
  const propertyType = firstString(sp.propertyType);
  const maxPriceRaw = firstString(sp.maxPrice);
  const maxPrice = maxPriceRaw ? parseInt(maxPriceRaw, 10) || 0 : 0;

  const [properties, searchConfigBase, powiaty] = await Promise.all([
    getPropertyListing({ powiat, propertyType, maxPrice }),
    getSearchConfigBase(),
    getPowiatyList(),
  ]);

  const searchConfig = {
    ...searchConfigBase,
    locationOptions: ["Cała oferta", ...powiaty.map((p) => p.name)],
  };

  return (
    <section id="nieruchomosci-listing">
      <div className="wrap">
        <div className="sec-head">
          <span className="eyebrow">Aktualna oferta</span>
          <h2>Wszystkie nieruchomości</h2>
          <p>Przeglądaj pełną ofertę i zawężaj wyniki według lokalizacji, typu i ceny.</p>
        </div>

        <div style={{ marginBottom: "44px" }}>
          <SearchBar
            config={searchConfig}
            defaultValues={{ powiat, propertyType, maxPrice: maxPriceRaw }}
          />
        </div>

        {properties.length === 0 ? (
          <p>Brak ofert spełniających wybrane kryteria.</p>
        ) : (
          <div className="prop-grid">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                href={`/nieruchomosci/${property.slug}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
