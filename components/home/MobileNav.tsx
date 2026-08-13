"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { CmsLink } from "@/content/types";

export function MobileNav({ links, phone }: { links: CmsLink[]; phone: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1181px)");
    function handleChange(e: MediaQueryListEvent) {
      if (e.matches) setOpen(false);
    }
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  return (
    <>
      <button
        type="button"
        className="mobile-menu-toggle"
        aria-expanded={open}
        aria-label={open ? "Zamknij menu" : "Otwórz menu"}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span />
        <span />
        <span />
      </button>
      {open && (
        <div className="mobile-menu">
          <ul>
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} onClick={() => setOpen(false)}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <a className="mobile-menu-phone" href={`tel:${phone.replace(/\s+/g, "")}`}>
            {phone}
          </a>
        </div>
      )}
    </>
  );
}
