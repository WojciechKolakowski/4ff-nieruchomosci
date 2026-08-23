import { getHomepageContent } from "@/content/homepage";
import { getGlobalSettings } from "@/content/global-settings";
import { Hero } from "@/components/home/Hero";
import { TrustBar } from "@/components/home/TrustBar";
import { FeaturedProperties } from "@/components/home/FeaturedProperties";
import { WhyUs } from "@/components/home/WhyUs";
import { CtaBand } from "@/components/home/CtaBand";
import { Testimonials } from "@/components/home/Testimonials";
import { ServiceAreaRibbon } from "@/components/home/ServiceAreaRibbon";

export default async function Home() {
  const [content, global] = await Promise.all([getHomepageContent(), getGlobalSettings()]);

  return (
    <>
      <Hero content={content.hero} searchConfig={content.searchConfig} />
      <TrustBar items={global.trustBarItems} />
      <FeaturedProperties properties={content.featuredProperties} />
      <WhyUs content={content.whyUs} />
      <CtaBand />
      <Testimonials />
      <ServiceAreaRibbon content={content.serviceArea} powiaty={content.powiaty} />
    </>
  );
}
