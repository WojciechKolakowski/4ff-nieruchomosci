import type { PropertyCard } from "@/content/properties";

export function FeaturedProperties({ properties }: { properties: PropertyCard[] }) {
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
            <div className="prop-card" key={property.id}>
              <div className="prop-photo" style={{ background: property.placeholderGradient }}>
                {property.highlightLabel && (
                  <span className="prop-tag">{property.highlightLabel}</span>
                )}
                <span className="ph-label">{property.placeholderLabel}</span>
              </div>
              <div className="prop-body">
                <div className="prop-loc">{property.locationLabel}</div>
                <div className="prop-title">{property.title}</div>
                <div className="prop-meta">
                  {property.metaItems.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
                <div className="prop-foot">
                  <span className="prop-price">{property.priceLabel}</span>
                  <a href="#" className="prop-link">
                    Szczegóły →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="see-all">
          <a
            href="#"
            className="btn btn-outline"
            style={{ borderColor: "var(--line)", color: "var(--charcoal)" }}
          >
            Zobacz wszystkie nieruchomości
          </a>
        </div>
      </div>
    </section>
  );
}
