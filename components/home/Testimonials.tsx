import type { Testimonial } from "@/content/testimonials";

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <section id="opinie">
      <div className="wrap">
        <div className="sec-head center" style={{ marginBottom: "48px" }}>
          <span className="eyebrow">Opinie klientów</span>
          <h2>Co mówią osoby, którym pomogliśmy</h2>
        </div>
        <div className="testi-grid">
          {testimonials.map((testimonial) => (
            <div className="testi-card" key={testimonial.id}>
              <div className="stars">{"★".repeat(testimonial.rating)}</div>
              <p>{testimonial.quote}</p>
              <div className="testi-who">
                <div className="testi-avatar" />
                <div>
                  <strong>{testimonial.clientSignature}</strong>
                  <span>{testimonial.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
