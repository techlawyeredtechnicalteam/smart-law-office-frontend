"use client";
import { AboutSection } from "@/components/shared/landingPageSections/About";
import { FeaturesSection } from "@/components/shared/landingPageSections/Features";
import Header from "@/components/shared/landingPageSections/Header";
import { WhyChooseUsSection } from "@/components/shared/landingPageSections/WhyChooseUsSection";
import PricingSection from "@/components/shared/landingPageSections/Pricing";
import { Footer } from "@/components/shared/landingPageSections/Footer";
import Hero from "@/components/shared/landingPageSections/Hero";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <AboutSection />
        <FeaturesSection />
        <WhyChooseUsSection />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}
