"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export interface CookieCategories {
  analytics: boolean;
  marketing: boolean;
}

interface StoredConsent extends CookieCategories {
  timestamp: string;
}

const STORAGE_KEY = "4ff-cookie-consent-v1";

interface CookieConsentContextValue {
  isOpen: boolean;
  view: "banner" | "settings";
  categories: CookieCategories;
  hasConsent: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  savePreferences: (categories: CookieCategories) => void;
  openSettings: () => void;
  closeSettings: () => void;
}

const CookieConsentContext = createContext<CookieConsentContextValue | null>(null);

function readStoredConsent(): StoredConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredConsent) : null;
  } catch {
    return null;
  }
}

function writeStoredConsent(categories: CookieCategories) {
  try {
    const value: StoredConsent = { ...categories, timestamp: new Date().toISOString() };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // localStorage unavailable — consent just won't persist across visits
  }
}

export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
  const [hasConsent, setHasConsent] = useState(false);
  const [categories, setCategories] = useState<CookieCategories>({
    analytics: false,
    marketing: false,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<"banner" | "settings">("banner");

  useEffect(() => {
    // localStorage is unavailable during SSR, so consent can only be read
    // client-side after mount — this is the standard exception to
    // react-hooks/set-state-in-effect, not a derived-state anti-pattern.
    const stored = readStoredConsent();
    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHasConsent(true);
      setCategories({ analytics: stored.analytics, marketing: stored.marketing });
      setIsOpen(false);
    } else {
      setIsOpen(true);
      setView("banner");
    }
  }, []);

  const value = useMemo<CookieConsentContextValue>(
    () => ({
      isOpen,
      view,
      categories,
      hasConsent,
      acceptAll: () => {
        const next = { analytics: true, marketing: true };
        setCategories(next);
        setHasConsent(true);
        setIsOpen(false);
        writeStoredConsent(next);
      },
      rejectAll: () => {
        const next = { analytics: false, marketing: false };
        setCategories(next);
        setHasConsent(true);
        setIsOpen(false);
        writeStoredConsent(next);
      },
      savePreferences: (next) => {
        setCategories(next);
        setHasConsent(true);
        setIsOpen(false);
        writeStoredConsent(next);
      },
      openSettings: () => {
        setView("settings");
        setIsOpen(true);
      },
      closeSettings: () => {
        setIsOpen(false);
      },
    }),
    [isOpen, view, categories, hasConsent]
  );

  return (
    <CookieConsentContext.Provider value={value}>{children}</CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) {
    throw new Error("useCookieConsent must be used within a CookieConsentProvider");
  }
  return ctx;
}
