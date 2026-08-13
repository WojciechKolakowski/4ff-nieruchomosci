import Image from "next/image";
import Link from "next/link";
import type { GlobalSettings } from "@/content/global-settings";
import { OpenLoginModalButton } from "./OpenLoginModalButton";

export function Header({ global }: { global: GlobalSettings }) {
  const { logo, navLinks, phone, loginButtonLabel, ctaValuationButtonLabel } = global;
  const [phonePrefix, ...rest] = phone.split(" ");
  const phoneNumber = rest.join(" ");

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
            {navLinks.map((link) => (
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
