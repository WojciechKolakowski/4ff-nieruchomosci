import Image from "next/image";
import Link from "next/link";
import type { CmsImage } from "@/content/types";
import { PLACEHOLDER_LABEL } from "@/content/placeholders";

interface PropertyCardData {
  id: string;
  title: string;
  locationLabel: string;
  metaItems: string[];
  priceLabel?: string;
  highlightLabel?: string;
  gallery: CmsImage[];
  placeholderGradient: string;
}

export function PropertyCard({ property, href }: { property: PropertyCardData; href: string }) {
  const photo = property.gallery[0];

  return (
    <div className="prop-card">
      <div
        className="prop-photo"
        style={photo ? undefined : { background: property.placeholderGradient }}
      >
        {photo ? (
          <Image
            src={photo.src}
            alt={photo.alt || property.title}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 920px) 100vw, 33vw"
          />
        ) : (
          <span className="ph-label">{PLACEHOLDER_LABEL}</span>
        )}
        {property.highlightLabel && <span className="prop-tag">{property.highlightLabel}</span>}
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
          <Link href={href} className="prop-link">
            Szczegóły →
          </Link>
        </div>
      </div>
    </div>
  );
}
