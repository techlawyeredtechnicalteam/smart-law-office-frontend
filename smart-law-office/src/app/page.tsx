"use client";
import { AboutSection } from "@/components/layout/landingPageSections/About";
import { FeaturesSection } from "@/components/layout/landingPageSections/Features";
import Header from "@/components/layout/landingPageSections/Header";
import { WhyChooseUsSection } from "@/components/layout/landingPageSections/WhyChooseUsSection";
import PricingSection from "@/components/layout/landingPageSections/Pricing";
import { Footer } from "@/components/layout/landingPageSections/Footer";
import Hero from "@/components/layout/landingPageSections/Hero";

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
