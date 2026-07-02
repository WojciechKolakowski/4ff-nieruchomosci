"use client";

import { useState } from "react";
import type { LeadFormContent } from "@/content/hero";

export function LeadForm({ content }: { content: LeadFormContent }) {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="lead-card-wrap">
      <div className="lead-card" id="lead">
        <h3>{content.heading}</h3>
        <p className="sub">{content.subheading}</p>
        {submitted ? (
          <p>Dziękujemy! Odezwiemy się w ciągu 24h.</p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
          >
            <div className="field">
              <label htmlFor="name">{content.nameLabel}</label>
              <input id="name" type="text" placeholder={content.namePlaceholder} required />
            </div>
            <div className="field">
              <label htmlFor="phone">{content.phoneLabel}</label>
              <input id="phone" type="tel" placeholder={content.phonePlaceholder} required />
            </div>
            <div className="field">
              <label htmlFor="interest">{content.interestLabel}</label>
              <select id="interest">
                {content.interestOptions.map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div className="consent">
              <input type="checkbox" id="c1" required />
              <label htmlFor="c1">{content.consentRequiredLabel}</label>
            </div>
            <div className="consent">
              <input type="checkbox" id="c2" />
              <label htmlFor="c2">{content.consentMarketingLabel}</label>
            </div>
            <button type="submit" className="btn btn-gold">
              {content.submitButtonLabel}
            </button>
            <p className="rodo-note">{content.rodoNote}</p>
          </form>
        )}
      </div>
    </div>
  );
}
