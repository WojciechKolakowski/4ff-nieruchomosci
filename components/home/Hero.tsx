import type { HeroContent } from "@/content/hero";
import type { SearchFormConfig } from "@/content/search-config";
import { HeroCarousel } from "./HeroCarousel";
import { SearchBar } from "./SearchBar";
import { LeadForm } from "./LeadForm";

export function Hero({
  content,
  searchConfig,
}: {
  content: HeroContent;
  searchConfig: SearchFormConfig;
}) {
  return (
    <section className="hero">
      <div className="hero-copy">
        <span className="eyebrow on-dark">{content.eyebrow}</span>
        <h1>
          {content.headlineBefore} <em>{content.highlightedWord}</em>,<br />
          {content.headlineAfter}
        </h1>
        <p>{content.description}</p>
        <div className="hero-actions">
          <a href={content.primaryButton.href} className="btn btn-rust">
            {content.primaryButton.label}
          </a>
          <a href={content.secondaryButton.href} className="btn btn-outline">
            {content.secondaryButton.label}
          </a>
        </div>
        <div className="hero-stats">
          {content.stats.map((stat) => (
            <div key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <HeroCarousel slides={content.slides} />

      <div className="wrap">
        <SearchBar config={searchConfig} />
      </div>

      <LeadForm content={content.leadForm} />
    </section>
  );
}
