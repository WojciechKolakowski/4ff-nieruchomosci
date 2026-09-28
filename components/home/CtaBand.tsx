import Link from "next/link";

export function CtaBand() {
  return (
    <div className="cta-band">
      <div className="wrap">
        <div>
          <h2>Sprzedajesz nieruchomość? Sprawdzimy, za ile możesz ją sprzedać!</h2>
          <p>
            Krótka rozmowa, realna cena transakcyjna i plan sprzedaży dopasowany do Twojej
            sytuacji — bez zobowiązań.
          </p>
        </div>
        <Link href="/#lead" className="btn btn-gold">
          Umów rozmowę
        </Link>
      </div>
    </div>
  );
}
