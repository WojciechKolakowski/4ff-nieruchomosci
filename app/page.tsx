import { getHomepageContent } from "@/content/homepage";
import { Header } from "@/components/home/Header";
import { Hero } from "@/components/home/Hero";
import { TrustBar } from "@/components/home/TrustBar";
import { FeaturedProperties } from "@/components/home/FeaturedProperties";
import { VipSection } from "@/components/home/VipSection";
import { WhyUs } from "@/components/home/WhyUs";
import { CtaBand } from "@/components/home/CtaBand";
import { Testimonials } from "@/components/home/Testimonials";
import { ServiceAreaRibbon } from "@/components/home/ServiceAreaRibbon";
import { Footer } from "@/components/home/Footer";
import { CookieBar } from "@/components/home/CookieBar";
import { LoginModal } from "@/components/home/LoginModal";

export default async function Home() {
  const content = await getHomepageContent();

  return (
    <>
      <Header global={content.global} />
      <Hero content={content.hero} searchConfig={content.searchConfig} />
      <TrustBar items={content.global.trustBarItems} />
      <FeaturedProperties properties={content.featuredProperties} />
      <VipSection content={content.vip} vipProperties={content.vipProperties} />
      <WhyUs content={content.whyUs} />
      <CtaBand />
      <Testimonials testimonials={content.testimonials} />
      <ServiceAreaRibbon powiaty={content.powiaty} />
      <Footer global={content.global} content={content.footer} />
      <CookieBar content={content.footer} />
      <LoginModal />
    </>
  );
}
