import { Suspense } from "react";
import { getGlobalSettings } from "@/content/global-settings";
import { getFooterContent } from "@/content/footer";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { CookieConsentProvider } from "@/components/home/CookieConsentProvider";
import { CookieBar } from "@/components/home/CookieBar";
import { MetaPixel } from "@/components/home/MetaPixel";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [global, footer] = await Promise.all([getGlobalSettings(), getFooterContent()]);

  return (
    <CookieConsentProvider>
      <Suspense fallback={null}>
        <MetaPixel />
      </Suspense>
      <Header global={global} />
      {children}
      <Footer global={global} content={footer} />
      <CookieBar content={footer} />
    </CookieConsentProvider>
  );
}
