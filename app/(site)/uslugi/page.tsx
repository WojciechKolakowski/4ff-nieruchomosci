import type { Metadata } from "next";
import Link from "next/link";
import { getPageBySlug } from "@/content/page";

const SERVICE_SLUGS = [
  "sprzedaz-nieruchomosci",
  "zakup-nieruchomosci",
  "finansowanie-kredyt",
  "home-staging",
] as const;

export const metadata: Metadata = {
  title: "Usługi | 4FF Nieruchomości",
  description:
    "Sprzedaż, zakup, finansowanie i home staging nieruchomości w Pabianicach i okolicy — pełen zakres usług biura 4FF Nieruchomości.",
};

export default async function UslugiPage() {
  const pages = (
    await Promise.all(SERVICE_SLUGS.map((slug) => getPageBySlug(slug)))
  ).filter((page): page is NonNullable<typeof page> => page !== null);

  return (
    <section className="content-page">
      <div className="wrap">
        <div className="sec-head">
          <span className="eyebrow">Nasza oferta</span>
          <h1>Usługi</h1>
          <p>
            Kompleksowo prowadzimy Cię przez sprzedaż, zakup, finansowanie i
            przygotowanie nieruchomości do prezentacji — wybierz obszar, który
            Cię interesuje.
          </p>
        </div>

        <div className="service-grid">
          {pages.map((page) => (
            <div className="service-card" key={page.slug}>
              <h3>{page.heading}</h3>
              {page.lead && <p>{page.lead}</p>}
              <Link href={`/${page.slug}`} className="btn btn-outline" style={{ borderColor: "var(--line)", color: "var(--charcoal)" }}>
                Dowiedz się więcej
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
