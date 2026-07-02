import type { WhyUsContent } from "@/content/why-us";

export function WhyUs({ content }: { content: WhyUsContent }) {
  return (
    <section className="why" id="dlaczego">
      <div className="wrap">
        <div className="sec-head">
          <span className="eyebrow on-dark">{content.eyebrow}</span>
          <h2>{content.heading}</h2>
          <p>{content.description}</p>
        </div>
        <div className="why-grid">
          {content.cards.map((card) => (
            <div className="why-card" key={card.title}>
              <div className="num">{card.label}</div>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
