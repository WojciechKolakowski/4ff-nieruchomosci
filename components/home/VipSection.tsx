import type { VipProgramContent } from "@/content/vip-program";
import type { PropertyCard } from "@/content/properties";
import { OpenLoginModalButton } from "./OpenLoginModalButton";

function daysUntil(dateStr: string) {
  const target = new Date(`${dateStr}T00:00:00`);
  const now = new Date();
  const diffMs = target.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

export function VipSection({
  content,
  vipProperties,
}: {
  content: VipProgramContent;
  vipProperties: PropertyCard[];
}) {
  return (
    <section id="vip" className="vip">
      <div className="wrap">
        <div className="vip-inner">
          <div className="vip-copy">
            <span className="eyebrow">{content.eyebrow}</span>
            <h2>{content.heading}</h2>
            <p>{content.description}</p>
            <ul className="vip-points">
              {content.steps.map((step) => (
                <li key={step.number}>
                  <span>{step.number}</span>
                  {step.description}
                </li>
              ))}
            </ul>
            <OpenLoginModalButton className="btn btn-gold">
              {content.ctaButtonLabel}
            </OpenLoginModalButton>
          </div>

          <div className="vip-cards">
            {vipProperties.map((property) => (
              <div className="vip-card" key={property.id}>
                <div
                  className="vip-photo"
                  style={{ background: property.placeholderGradient }}
                >
                  <div className="lock-overlay">
                    <span className="lock-ico">🔒</span>
                    <span className="lock-text">
                      Publicznie za {property.unlockDate ? daysUntil(property.unlockDate) : "?"}{" "}
                      dni
                    </span>
                  </div>
                </div>
                <div className="vip-body">
                  <span className="prop-loc">{property.locationLabel}</span>
                  <div className="prop-title">{property.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
