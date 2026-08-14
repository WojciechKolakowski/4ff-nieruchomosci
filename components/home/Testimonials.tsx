import { GoogleReviewsWidget } from "./GoogleReviewsWidget";

export function Testimonials() {
  return (
    <section id="opinie">
      <div className="wrap">
        <div className="sec-head center" style={{ marginBottom: "48px" }}>
          <span className="eyebrow">Opinie klientów</span>
          <h2>Co mówią osoby, którym pomogliśmy</h2>
        </div>
        <GoogleReviewsWidget />
      </div>
    </section>
  );
}
