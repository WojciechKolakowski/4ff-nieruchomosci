import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { getArticleBySlug, getAllArticleSlugs } from "@/content/poradnik";

export async function generateStaticParams() {
  const slugs = await getAllArticleSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) {
    return {};
  }
  return {
    title: article.metaTitle || `${article.title} | Poradnik 4FF Nieruchomości`,
    description: article.metaDescription || article.excerpt,
    openGraph: article.coverImage ? { images: [{ url: article.coverImage.src }] } : undefined,
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <section className="content-page">
      <div className="wrap">
        <Link href="/poradnik" className="article-back-link">
          ← Wróć do listy artykułów
        </Link>
        <div className="sec-head" style={{ maxWidth: "760px" }}>
          {article.category && <span className="eyebrow">{article.category}</span>}
          <h1>{article.title}</h1>
          {article.excerpt && <p>{article.excerpt}</p>}
        </div>

        {article.coverImage && (
          <div className="article-cover">
            <Image
              src={article.coverImage.src}
              alt={article.coverImage.alt || article.title}
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 920px) 100vw, 760px"
              priority
            />
          </div>
        )}

        {article.body && article.body.length > 0 && (
          <div className="property-description" style={{ maxWidth: "760px" }}>
            <PortableText value={article.body} />
          </div>
        )}

        <Link href="/poradnik" className="btn btn-outline" style={{ marginTop: "32px" }}>
          ← Wszystkie artykuły
        </Link>
      </div>
    </section>
  );
}
