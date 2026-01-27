"use client";
import Image from "next/image";
import React from "react";
import { Button } from "../../ui/button";
import { motion, Variants } from "framer-motion";

// animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.1
    }
  }
};

// individual item (fade in + slide up)
const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 150,
      damping: 25
    }
  }
};

const imageVariants: Variants = {
  hidden: {
    y: 100,
    opacity: 0
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      delay: 0.4
    }
  }
};

const Hero = () => {
  return (
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
      <motion.div
        className="relative z-10 w-full grow flex flex-col items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 text-center w-full">
          {/* Text Content (Top Half) */}
          <div className="-pt-12">
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-violet-500 font-extrabold mb-6 leading-tight max-w-4xl mx-auto"
            >
              The Operating System for{" "}
              <span className="text-black">Modern Law Firms</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-gray-800 mb-10 max-w-3xl mx-auto"
            >
              Streamline your practice with LegalFlow. From seamless client
              onboarding to automated document management, we provide the tools
              you need to run a 21st-century law office from anywhere.
            </motion.p>

            {/* Button Group */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8 lg:mb-12"
            >
              <Button variant="default" className="bg-violet-600">
                <a href="/role">Launch your Law Office</a>
              </Button>
              <Button
                variant="secondary"
                className="bg-violet-300 text-violet-600 hover:bg-violet-100"
              >
                Schedule a Demo
              </Button>
            </motion.div>
          </div>

          {/* Visual Screen Image (Directly under the buttons) */}
          <motion.div
            variants={imageVariants}
            className="w-full relative px-4 sm:px-8 max-w-6xl mx-auto"
          >
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
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
