import type { Metadata } from "next";
import { getArticleList } from "@/content/poradnik";
import { ArticleCard } from "@/components/poradnik/ArticleCard";

export const metadata: Metadata = {
  title: "Poradnik — porady dla kupujących i sprzedających | 4FF Nieruchomości",
  description:
    "Praktyczne wskazówki o sprzedaży, zakupie, home stagingu i finansowaniu nieruchomości w województwie łódzkim — od zespołu 4FF Nieruchomości.",
};

export default async function PoradnikPage() {
  const articles = await getArticleList();

  return (
    <section className="content-page">
      <div className="wrap">
        <div className="sec-head">
          <span className="eyebrow">Poradnik</span>
          <h1>Praktyczne porady od naszego zespołu</h1>
          <p>
            Krótkie, konkretne wskazówki o sprzedaży, zakupie, przygotowaniu nieruchomości i
            finansowaniu — z perspektywy agencji, która na co dzień działa w województwie łódzkim.
          </p>
        </div>

        {articles.length === 0 ? (
          <p>Wkrótce pojawią się tu pierwsze artykuły.</p>
        ) : (
          <div className="prop-grid">
            {articles.map((article, index) => (
              <ArticleCard article={article} index={index} key={article.slug} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
