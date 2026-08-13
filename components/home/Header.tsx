import Image from "next/image";
import Link from "next/link";
import type { GlobalSettings } from "@/content/global-settings";
import { OpenLoginModalButton } from "./OpenLoginModalButton";

// Older CMS data may still list the individual service pages as separate
// nav entries; they now live under the single "Usługi" link below.
const SERVICE_HREFS = new Set([
  "/sprzedaz-nieruchomosci",
  "/zakup-nieruchomosci",
  "/finansowanie-kredyt",
  "/home-staging",
]);

export function Header({ global }: { global: GlobalSettings }) {
  const { logo, navLinks, phone, loginButtonLabel, ctaValuationButtonLabel } = global;
  const [phonePrefix, ...rest] = phone.split(" ");
  const phoneNumber = rest.join(" ");
  const [firstLink, ...restLinks] = navLinks.filter((link) => !SERVICE_HREFS.has(link.href));

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
            {firstLink && (
              <li key={firstLink.href}>
                <Link href={firstLink.href}>{firstLink.label}</Link>
              </li>
            )}
            <li>
              <Link href="/uslugi">Usługi</Link>
            </li>
            {restLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="nav-cta">
          <span className="phone-chip">
            {phonePrefix} <span>{phoneNumber}</span>
          </span>
          <OpenLoginModalButton className="btn btn-outline">
            {loginButtonLabel}
          </OpenLoginModalButton>
          <Link href="/#lead" className="btn btn-gold">
            {ctaValuationButtonLabel}
          </Link>
        </div>
      </div>
    </header>
  );
}
