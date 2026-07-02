"use client";

import { useState } from "react";
import type { FooterContent } from "@/content/footer";

type CookieBarContent = Pick<
  FooterContent,
  "cookieBannerText" | "cookieAcceptLabel" | "cookieRejectLabel"
>;

export function CookieBar({ content }: { content: CookieBarContent }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return null;
  }

  return (
    <div className="cookie-bar">
      <p>{content.cookieBannerText}</p>
      <div className="cookie-actions">
        <button className="cookie-reject" onClick={() => setDismissed(true)}>
          {content.cookieRejectLabel}
        </button>
        <button className="cookie-accept" onClick={() => setDismissed(true)}>
          {content.cookieAcceptLabel}
        </button>
      </div>
    </div>
  );
}
