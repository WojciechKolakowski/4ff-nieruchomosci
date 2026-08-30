import Image from "next/image";
import Link from "next/link";
import type { GlobalSettings } from "@/content/global-settings";
import { MobileNav } from "./MobileNav";

// Older CMS data may still list the individual service pages as separate
// nav entries; they now live under the single "Usługi" link below.
// "/#vip" is filtered out because the VIP program (login + early-access
// section) is paused until it has a working backend — see VipSection.
const HIDDEN_HREFS = new Set([
  "/sprzedaz-nieruchomosci",
  "/zakup-nieruchomosci",
  "/finansowanie-kredyt",
  "/home-staging",
  "/#vip",
]);

export function Header({ global }: { global: GlobalSettings }) {
  const { logo, navLinks, phone, ctaValuationButtonLabel } = global;
  const [phonePrefix, ...rest] = phone.split(" ");
  const phoneNumber = rest.join(" ");
  const [firstLink, ...restLinks] = navLinks.filter((link) => !HIDDEN_HREFS.has(link.href));
  const uslugiLink = { label: "Usługi", href: "/uslugi" };
  const displayLinks = firstLink ? [firstLink, uslugiLink, ...restLinks] : [uslugiLink, ...restLinks];

  return (
    <header>
      <div className="nav-inner">
        <Link href="/" className="logo">
          <Image
            src={logo.light.src}
            alt={logo.light.alt}
            width={logo.light.width}
            height={logo.light.height}
            className="logo-img"
          />
        </Link>
        <nav>
          <ul>
            {displayLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="nav-cta">
          <a href={`tel:${phone.replace(/\s+/g, "")}`} className="phone-chip">
            {phonePrefix} <span>{phoneNumber}</span>
          </a>
          <Link href="/#lead" className="btn btn-gold">
            {ctaValuationButtonLabel}
          </Link>
          <MobileNav links={displayLinks} phone={phone} />
        </div>
      </div>
    </header>
  );
}
