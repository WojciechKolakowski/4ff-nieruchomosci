"use client";

import { useState } from "react";
import type { LeadFormContent } from "@/content/hero";

export function LeadForm({ content }: { content: LeadFormContent }) {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className="lead-card-wrap">
      <div className="lead-card" id="lead">
        <h3>{content.heading}</h3>
        <p className="sub">{content.subheading}</p>
        {submitted ? (
          <p>Dziękujemy! Odezwiemy się w ciągu 24h.</p>
        ) : (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setError(false);
              setIsSubmitting(true);

              const form = e.currentTarget;
              const data = new FormData(form);

              try {
                const res = await fetch("/api/lead", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    name: data.get("name"),
                    phone: data.get("phone"),
                    interest: data.get("interest"),
                    marketingConsent: data.get("marketingConsent") === "on",
                    consentRequired: data.get("consentRequired") === "on",
                  }),
                });
                if (!res.ok) throw new Error("request failed");
                setSubmitted(true);
              } catch {
                setError(true);
              } finally {
                setIsSubmitting(false);
              }
            }}
          >
            <div className="field">
              <label htmlFor="name">{content.nameLabel}</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder={content.namePlaceholder}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="phone">{content.phoneLabel}</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder={content.phonePlaceholder}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="interest">{content.interestLabel}</label>
              <select id="interest" name="interest">
                {content.interestOptions.map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div className="consent">
              <input type="checkbox" id="c1" name="consentRequired" required />
              <label htmlFor="c1">{content.consentRequiredLabel}</label>
            </div>
            <div className="consent">
              <input type="checkbox" id="c2" name="marketingConsent" />
              <label htmlFor="c2">{content.consentMarketingLabel}</label>
            </div>
            <button type="submit" className="btn btn-gold" disabled={isSubmitting}>
              {isSubmitting ? "Wysyłanie..." : content.submitButtonLabel}
            </button>
            {error && (
              <p className="rodo-note" style={{ color: "var(--rust)" }}>
                Coś poszło nie tak. Spróbuj ponownie lub zadzwoń do nas bezpośrednio.
              </p>
            )}
            <p className="rodo-note">{content.rodoNote}</p>
          </form>
        )}
      </div>
    </div>
  );
}
