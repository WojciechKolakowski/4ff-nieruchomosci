import { getGlobalSettings } from "@/content/global-settings";
import { getFooterContent } from "@/content/footer";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { CookieBar } from "@/components/home/CookieBar";
import { LoginModal } from "@/components/home/LoginModal";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [global, footer] = await Promise.all([getGlobalSettings(), getFooterContent()]);

  return (
    <>
      <Header global={global} />
      {children}
      <Footer global={global} content={footer} />
      <CookieBar content={footer} />
      <LoginModal />
    </>
  );
}
