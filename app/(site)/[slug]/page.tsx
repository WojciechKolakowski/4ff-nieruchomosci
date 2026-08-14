import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { getPageBySlug, getAllPageSlugs } from "@/content/page";

const SERVICE_SLUGS = new Set([
  "sprzedaz-nieruchomosci",
  "zakup-nieruchomosci",
  "finansowanie-kredyt",
  "home-staging",
]);

export async function generateStaticParams() {
  const slugs = await getAllPageSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) {
    return {};
  }
  return {
    title: page.metaTitle || page.heading,
    description: page.metaDescription,
  };
}

export default async function ContentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <section className="content-page">
      <div className="wrap">
        {SERVICE_SLUGS.has(slug) && (
          <Link href="/uslugi" className="article-back-link">
            ← Wróć do listy usług
          </Link>
        )}
        <div className="sec-head">
          {page.eyebrow && <span className="eyebrow">{page.eyebrow}</span>}
          <h1>{page.heading}</h1>
          {page.lead && <p>{page.lead}</p>}
        </div>

        {page.body && page.body.length > 0 && (
          <div className="property-description" style={{ maxWidth: "760px" }}>
            <PortableText value={page.body} />
          </div>
        )}

        {page.ctaLabel && page.ctaHref && (
          <Link href={page.ctaHref} className="btn btn-gold">
            {page.ctaLabel}
          </Link>
        )}
      </div>
    </section>
  );
}
