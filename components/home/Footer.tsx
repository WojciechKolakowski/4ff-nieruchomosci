import Image from "next/image";
import type { GlobalSettings } from "@/content/global-settings";
import type { FooterContent } from "@/content/footer";

export function Footer({
  global,
  content,
}: {
  global: GlobalSettings;
  content: FooterContent;
}) {
  return (
    <footer id="kontakt">
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-col foot-brand">
            <div className="logo" style={{ marginBottom: "18px" }}>
              <Image
                src={global.logo.light.src}
                alt={global.logo.light.alt}
                width={global.logo.light.width}
                height={global.logo.light.height}
                className="logo-img"
                style={{ height: "60px", width: "auto" }}
              />
            </div>
            <p>{content.companyDescription}</p>
            <div className="social-row">
              {global.socialLinks.facebook && (
                <a href={global.socialLinks.facebook} aria-label="Facebook">
                  f
                </a>
              )}
              {global.socialLinks.instagram && (
                <a href={global.socialLinks.instagram} aria-label="Instagram">
                  ig
                </a>
              )}
              {global.socialLinks.youtube && (
                <a href={global.socialLinks.youtube} aria-label="YouTube">
                  yt
                </a>
              )}
            </div>
          </div>
          <div className="foot-col">
            <h4>Nawigacja</h4>
            {content.navLinks.map((link) => (
              <a href={link.href} key={link.href}>
                {link.label}
              </a>
            ))}
          </div>
          <div className="foot-col">
            <h4>Usługi</h4>
            {content.serviceLinks.map((link) => (
              <a href={link.href} key={link.label}>
                {link.label}
              </a>
            ))}
          </div>
          <div className="foot-col">
            <h4>Kontakt</h4>
            {content.contactLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>
        <div className="foot-bottom">
          <span>{content.copyrightText}</span>
          <span>
            {content.legalLinks.map((link) => (
              <a href={link.href} key={link.label}>
                {link.label}
              </a>
            ))}
          </span>
        </div>
      </div>
    </footer>
  );
}
