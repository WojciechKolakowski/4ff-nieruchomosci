import Link from "next/link";

export function CtaBand() {
  return (
    <div className="cta-band">
      <div className="wrap">
        <div>
          <h2>Sprzedajesz nieruchomość? Wycenimy ją bezpłatnie.</h2>
          <p>
            Krótka rozmowa, konkretna wycena i plan sprzedaży dopasowany do Twojej sytuacji —
            bez zobowiązań.
          </p>
        </div>
        <Link href="/#lead" className="btn btn-gold">
          Umów rozmowę
        </Link>
      </div>
    </div>
  );
}
