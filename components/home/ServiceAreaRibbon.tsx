import type { Powiat } from "@/content/powiaty";

export function ServiceAreaRibbon({ powiaty }: { powiaty: Powiat[] }) {
  return (
    <section className="area" id="obszar">
      <div className="wrap">
        <div className="sec-head">
          <span className="eyebrow on-dark">Zasięg działania</span>
          <h2>Dwa regiony, jedno biuro zaufania</h2>
          <p>Obsługujemy transakcje nieruchomościowe w powiatach województwa łódzkiego i lubelskiego.</p>
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
          <span>Woj. Łódzkie</span>
          <span>Woj. Lubelskie</span>
        </div>
      </div>
    </section>
  );
}
