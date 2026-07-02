import Image from "next/image";
import type { GlobalSettings } from "@/content/global-settings";
import { OpenLoginModalButton } from "./OpenLoginModalButton";

export function Header({ global }: { global: GlobalSettings }) {
  const { logo, navLinks, phone, loginButtonLabel, ctaValuationButtonLabel } = global;
  const [phonePrefix, ...rest] = phone.split(" ");
  const phoneNumber = rest.join(" ");

  return (
    <header>
      <div className="nav-inner">
        <a href="#" className="logo">
          <Image
            src={logo.light.src}
            alt={logo.light.alt}
            width={logo.light.width}
            height={logo.light.height}
            className="logo-img"
          />
        </a>
        <nav>
          <ul>
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
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
          <a href="#lead" className="btn btn-gold">
            {ctaValuationButtonLabel}
          </a>
        </div>
      </div>
    </header>
  );
}
