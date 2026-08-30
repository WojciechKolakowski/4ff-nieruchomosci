import { getHomepageContent } from "@/content/homepage";
import { Hero } from "@/components/home/Hero";
import { FeaturedProperties } from "@/components/home/FeaturedProperties";
import { WhyUs } from "@/components/home/WhyUs";
import { CtaBand } from "@/components/home/CtaBand";
import { Testimonials } from "@/components/home/Testimonials";
import { ServiceAreaRibbon } from "@/components/home/ServiceAreaRibbon";

export default async function Home() {
  const content = await getHomepageContent();

  return (
    <>
      <Hero content={content.hero} searchConfig={content.searchConfig} />
      <FeaturedProperties properties={content.featuredProperties} />
      <WhyUs content={content.whyUs} />
      <CtaBand />
      <Testimonials />
      <ServiceAreaRibbon content={content.serviceArea} powiaty={content.powiaty} />
    </>
  );
}
