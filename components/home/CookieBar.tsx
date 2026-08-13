"use client";

import { useState } from "react";
import type { FooterContent } from "@/content/footer";
import { useCookieConsent, type CookieCategories } from "./CookieConsentProvider";

function CookieSettingsPanel({ content }: { content: FooterContent }) {
  const { categories, rejectAll, savePreferences, closeSettings, hasConsent } = useCookieConsent();
  // Mounted fresh each time the panel opens (see CookieBar below), so this
  // one-time initializer always picks up the current saved categories.
  const [draft, setDraft] = useState<CookieCategories>(categories);

  const necessary = content.cookieCategories.find((c) => c.key === "necessary");
  const analytics = content.cookieCategories.find((c) => c.key === "analytics");
  const marketing = content.cookieCategories.find((c) => c.key === "marketing");

  return (
    <div className="cookie-bar cookie-settings">
      <div className="cookie-settings-header">
        <h3>{content.cookieSettingsHeading}</h3>
        {hasConsent && (
          <button
            className="modal-close"
            onClick={closeSettings}
            aria-label="Zamknij"
            style={{ position: "static" }}
          >
            ✕
          </button>
        )}
      </div>
      <p>{content.cookieSettingsLead}</p>

      <div className="cookie-category">
        <label>
          <input type="checkbox" checked disabled />
          {necessary?.label}
        </label>
        <p>{necessary?.description}</p>
      </div>

      <div className="cookie-category">
        <label>
          <input
            type="checkbox"
            checked={draft.analytics}
            onChange={(e) => setDraft((prev) => ({ ...prev, analytics: e.target.checked }))}
          />
          {analytics?.label}
        </label>
        <p>{analytics?.description}</p>
      </div>

      <div className="cookie-category">
        <label>
          <input
            type="checkbox"
            checked={draft.marketing}
            onChange={(e) => setDraft((prev) => ({ ...prev, marketing: e.target.checked }))}
          />
          {marketing?.label}
        </label>
        <p>{marketing?.description}</p>
      </div>

      <div className="cookie-actions">
        <button className="cookie-reject" onClick={rejectAll}>
          {content.cookieRejectLabel}
        </button>
        <button className="cookie-accept" onClick={() => savePreferences(draft)}>
          {content.cookieSaveLabel}
        </button>
      </div>
    </div>
  );
}

export function CookieBar({ content }: { content: FooterContent }) {
  const { isOpen, view, acceptAll, rejectAll, openSettings } = useCookieConsent();

  if (!isOpen) {
    return null;
  }

  if (view === "settings") {
    return <CookieSettingsPanel content={content} />;
  }

  return (
    <div className="cookie-bar">
      <p>{content.cookieBannerText}</p>
      <div className="cookie-actions">
        <button className="cookie-reject" onClick={rejectAll}>
          {content.cookieRejectLabel}
        </button>
        <button className="cookie-customize" onClick={openSettings}>
          {content.cookieCustomizeLabel}
        </button>
        <button className="cookie-accept" onClick={acceptAll}>
          {content.cookieAcceptLabel}
        </button>
      </div>
    </div>
  );
}
