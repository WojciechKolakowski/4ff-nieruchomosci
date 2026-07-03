import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { getPropertyBySlug } from "@/content/property-detail";
import { getPublicPropertySlugs } from "@/content/property-listing";
import { PLACEHOLDER_LABEL } from "@/content/placeholders";

export async function generateStaticParams() {
  const slugs = await getPublicPropertySlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) {
    return {};
  }
  return {
    title: `${property.title} — 4FF Nieruchomości`,
    description: property.locationLabel,
  };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  const [mainPhoto, ...thumbnails] = property.gallery;

  return (
    <section className="property-detail">
      <div className="wrap">
        <div className="property-gallery">
          <div
            className="property-gallery-main"
            style={mainPhoto ? undefined : { background: "var(--olive-soft)" }}
          >
            {mainPhoto ? (
              <Image
                src={mainPhoto.src}
                alt={mainPhoto.alt || property.title}
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 920px) 100vw, 800px"
                priority
              />
            ) : (
              <span className="ph-label">{PLACEHOLDER_LABEL}</span>
            )}
          </div>
          {thumbnails.length > 0 && (
            <div className="property-gallery-thumbs">
              {thumbnails.map((photo, i) => (
                <div className="property-gallery-thumb" key={photo.src ?? i}>
                  <Image
                    src={photo.src}
                    alt={photo.alt || property.title}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="200px"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="property-body">
          <div className="prop-loc">{property.locationLabel}</div>
          <h1>{property.title}</h1>
          <div className="prop-meta">
            {property.metaItems.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <div className="property-price">{property.priceLabel}</div>

          {property.description && property.description.length > 0 && (
            <div className="property-description">
              <PortableText value={property.description} />
            </div>
          )}

          <Link href="/#lead" className="btn btn-gold">
            Zapytaj o tę nieruchomość
          </Link>
        </div>
      </div>
    </section>
  );
}
