import Link from "next/link";
import type { PropertyCard as PropertyCardData } from "@/content/properties";
import { PropertyCard } from "@/components/property/PropertyCard";

export function FeaturedProperties({ properties }: { properties: PropertyCardData[] }) {
  return (
    <section id="oferty">
      <div className="wrap">
        <div className="sec-head">
          <span className="eyebrow">Aktualna oferta</span>
          <h2>Wyróżnione nieruchomości</h2>
          <p>
            Każda oferta ma własną, szczegółową stronę — pełną galerię, rzuty i dane
            kontaktowe do bezpośredniej rozmowy.
          </p>
        </div>

        <div className="prop-grid">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              href={`/nieruchomosci/${property.slug}`}
            />
          ))}
        </div>

        <div className="see-all">
          <Link
            href="/nieruchomosci"
            className="btn btn-outline"
            style={{ borderColor: "var(--line)", color: "var(--charcoal)" }}
          >
            Zobacz wszystkie nieruchomości
          </Link>
        </div>
      </div>
    </section>
  );
}
