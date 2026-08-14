import Image from "next/image";
import Link from "next/link";
import type { ArticleListItem } from "@/content/poradnik";
import { PLACEHOLDER_LABEL, placeholderGradientFor } from "@/content/placeholders";

export function ArticleCard({ article, index }: { article: ArticleListItem; index: number }) {
  return (
    <div className="article-card">
      <div
        className="article-photo"
        style={article.coverImage ? undefined : { background: placeholderGradientFor(index) }}
      >
        {article.coverImage ? (
          <Image
            src={article.coverImage.src}
            alt={article.coverImage.alt || article.title}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 920px) 100vw, 33vw"
          />
        ) : (
          <span className="ph-label">{PLACEHOLDER_LABEL}</span>
        )}
        {article.category && <span className="prop-tag">{article.category}</span>}
      </div>
      <div className="prop-body">
        <div className="prop-title">{article.title}</div>
        {article.excerpt && <p className="article-excerpt">{article.excerpt}</p>}
        <Link href={`/poradnik/${article.slug}`} className="prop-link">
          Czytaj więcej →
        </Link>
      </div>
    </div>
  );
}
