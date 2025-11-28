"use client";
import { AboutSection } from "@/components/sections/About";
import { FeaturesSection } from "@/components/sections/Features";
import Header from "@/components/layout/Header";
import { WhyChooseUsSection } from "@/components/sections/WhyChooseUsSection";
import PricingSection from "@/components/sections/Pricing";
import { Footer } from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";

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
