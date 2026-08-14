"use client";

import Script from "next/script";
import { useCookieConsent } from "./CookieConsentProvider";
import { OpenCookieSettingsButton } from "./OpenCookieSettingsButton";

export function GoogleReviewsWidget() {
  const { hasConsent, categories } = useCookieConsent();

  if (!hasConsent || !categories.marketing) {
    return (
      <div className="reviews-consent-gate">
        <p>
          Aby zobaczyć opinie z Google, włącz zgodę na pliki cookies marketingowe.
        </p>
        <OpenCookieSettingsButton className="btn btn-outline">
          Ustawienia cookies
        </OpenCookieSettingsButton>
      </div>
    );
  }

  return (
    <>
      <Script src="https://elfsightcdn.com/platform.js" strategy="lazyOnload" />
      <div className="elfsight-app-a97dd258-15c2-4b62-bcf7-e6b39cbed80f" data-elfsight-app-lazy />
    </>
  );
}
