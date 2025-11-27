import { AboutSection } from "@/components/sections/About";
import { FeaturesSection } from "@/components/sections/Features";
import Header from "@/components/layout/Header";
import HeroDashboard from "@/components/layout/HeroDashboard";
import { WhyChooseUsSection } from "@/components/sections/WhyChooseUsSection";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import PricingSection from "@/components/sections/Pricing";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Content and Background */}
      <main>
        <section className="min-h-screen flex flex-col pt-24 pb-16 lg:pt-32 overflow-hidden relative">
          {/* Background ImageOverlay */}
          <div className="absolute inset-0 bg-violet-50 z-0">
            <div className="absolute inset-0 opacity-50">
              <Image
                src="/Landing page.png"
                alt="Hero"
                fill
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          {/* Hero Text and Content Wrapper (relative z-10) */}
          <div className="relative z-10 w-full grow flex flex-col items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 text-center w-full">
              {/* Text Content (Top Half) */}
              <div className="-pt-12">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-violet-500 font-extrabold mb-6 leading-tight max-w-4xl mx-auto">
                  Deliver Legal Support{" "}
                  <span className="text-black">Anytime, anywhere</span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-800 mb-10 max-w-3xl mx-auto">
                  Simplifying how clients access legal support. Book
                  consultations, manage documents and get your legal concerns
                  sorted. all in one place.
                </p>

                {/* Button Group */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8 lg:mb-12">
                  <Button variant="default" className="bg-violet-600">
                    Start Free Trial
                  </Button>
                  <Button
                    variant="secondary"
                    className="bg-white text-violet-600 hover:bg-violet-100"
                  >
                    Schedule a Demo
                  </Button>
                </div>
              </div>

              {/* Visual Screen Image (Directly under the buttons) */}
              <div className="w-full relative px-4 sm:px-8 max-w-6xl mx-auto">
                <div
                  className="relative w-full h-auto 
                                max-w-4xl
                                mx-auto                                
                                transform 
                                perspective-[1000px] 
                                rotate-x-6 
                                scale-[0.98]                                                                 
                                transition-all duration-500 
                                rounded-xl 
                                overflow-hidden"
                >
                  <Image
                    src="/DEMO.png"
                    alt="Platform Demo Screenshot"
                    width={1400}
                    height={800}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Hero Dashboard */}
        {/* <section className="relative z-10"></section> */}

        {/* About */}
        <AboutSection />
        {/* Card */}
        <FeaturesSection />
        {/* Why Choouse us */}
        <WhyChooseUsSection />
        {/* Pricing Section */}
        <PricingSection />
      </main>
      {/* Footer */}
      <Footer />
    </div>
  );
}
