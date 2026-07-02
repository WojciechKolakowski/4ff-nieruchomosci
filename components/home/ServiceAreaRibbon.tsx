import type { Powiat } from "@/content/powiaty";
import type { ServiceAreaContent } from "@/content/service-area";

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function ServiceAreaRibbon({
  content,
  powiaty,
}: {
  content: ServiceAreaContent;
  powiaty: Powiat[];
}) {
  const voivodeships = [...new Set(powiaty.map((p) => p.voivodeship))];

  return (
    <section className="area" id="obszar">
      <div className="wrap">
        <div className="sec-head">
          <span className="eyebrow on-dark">{content.eyebrow}</span>
          <h2>{content.heading}</h2>
          <p>{content.description}</p>
        </div>
        <div className="ribbon">
          <div className="ribbon-track">
            {powiaty.map((powiat) => (
              <div className="ribbon-item" key={powiat.name}>
                <span className="dot" />
                {powiat.name}
              </div>
            ))}
          </div>
        </div>
        <div className="voivod-labels">
          {voivodeships.map((voivodeship) => (
            <span key={voivodeship}>Woj. {capitalize(voivodeship)}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
