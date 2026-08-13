"use client";

import { useCookieConsent } from "./CookieConsentProvider";

export function OpenCookieSettingsButton({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const { openSettings } = useCookieConsent();
  return (
    <button className={className} onClick={openSettings}>
      {children}
    </button>
  );
}
