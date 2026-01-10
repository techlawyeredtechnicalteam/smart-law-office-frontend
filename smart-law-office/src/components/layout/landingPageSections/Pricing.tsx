"use client";

import { Check } from "lucide-react";
import { Button } from "../../ui/button";
import React, { useState } from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import {
  sectionStaggerContainer,
  fadeInSlideUp
} from "@/utils/landing-animation";

const pricingCardVariant: Variants = {
  hidden: { y: 50, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 70,
      damping: 15,
      delay: 0.4 // Delay so text appears first
    }
  }
};

const PricingSection: React.FC = () => {
  const [isMonthly, setIsMonthly] = useState(true);

  const price = isMonthly ? "7,500" : "82,500";
  const perText = isMonthly ? "/per counsel" : "/per year";

  // Pricing data extracted from the image
  const features = [
    "Full access to counsel dashboard",
    "Case status updates",
    "Access to assigned cases only",
    "Calendar and scheduling",
    "Real-time case notes and document management",
    "Support access"
  ];

  return (
    <section
      id="pricing"
      className="scroll-mt-24 py-20 md:py-32 bg-linear-to-b from-gray-200 via-gray-200 to-gray-200 text-gray-900"
    >
      <motion.div
        variants={sectionStaggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 text-center"
      >
        <motion.p
          variants={fadeInSlideUp}
          className="text-xs font-bold uppercase tracking-widest bg-violet-100 text-black mb-2 p-1 border border-violet-500 inline-block rounded-full px-6 py-2"
        >
          LEGAL MADE SIMPLE
        </motion.p>
        <motion.h2
          variants={fadeInSlideUp}
          className="text-4xl md:text-5xl font-extrabold mb-4"
        >
          Pricing
        </motion.h2>
        <motion.p
          variants={fadeInSlideUp}
          className="text-lg text-gray-600 mb-10 max-w-3xl mx-auto"
        >
          Whether you are working solo or as a team, Smart Law Office aligns
          with your needs. Best for counsels who want stability, uninterrupted
          access, and added value throughout the year.
        </motion.p>

        {/* Monthly/Yearly Toggle */}
        <motion.div
          variants={fadeInSlideUp}
          className="inline-flex bg-violet-50 px-6 py-2 rounded-full mb-12 shadow-inner cursor-pointer"
        >
          <button
            type="button"
            aria-label="Price Button"
            className={`py-2 px-6 rounded-full font-semibold text-sm transition ${
              isMonthly
                ? "bg-white/10 text-violet-800 shadow-md border border-white/50"
                : "text-gray-600 hover:text-violet-800"
            }`}
            onClick={() => setIsMonthly(true)}
          >
            Monthly
          </button>
          <button
            type="button"
            aria-label="Yearly Price Button"
            className={`py-2 px-6 rounded-full font-semibold text-sm transition ${
              !isMonthly
                ? "bg-white/20 text-violet-800 shadow-md border border-white/50"
                : "text-gray-600 hover:text-violet-800"
            }`}
            onClick={() => setIsMonthly(false)}
          >
            Yearly
          </button>
        </motion.div>

        {/* Pricing Card Wrapper */}
        <motion.div
          variants={pricingCardVariant}
          className="max-w-4xl mx-auto bg-violet-50 rounded-3xl p-8 md:p-16 text-left shadow-xl border border-gray-200"
        >
          {/* Title and Launching Price Banner */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4 space-y-2 md:space-y-0">
            {/* Counsel Title and Billing Info */}
            <div className="flex flex-col">
              <h3 className="text-xl font-bold text-gray-900">Counsel</h3>
              <p className="text-sm text-gray-600 mt-1">
                Billed {isMonthly ? "monthly" : "annually"}
              </p>
            </div>

            {/* Launch Price Banner */}
            <div className="flex items-center space-x-2 self-start md:self-auto">
              <p className="text-sm font-medium text-gray-500 hidden sm:block">
                Launching Price:
              </p>
              <div className="bg-violet-200 text-violet-800 font-semibold px-4 py-2 rounded-xl text-sm whitespace-nowrap inline-flex items-center justify-center">
                <span className="text-xs">₦ 15,000/per counsel</span>
              </div>
            </div>
          </div>

          {/* --- End of New Header --- */}

          {/* Original Price */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 border-t pt-6 border-gray-200">
            {/* Current Price */}
            <div className="mb-4 md:mb-0">
              <p className="text-4xl font-extrabold text-black">
                ₦{price}
                <span className="text-base font-normal text-gray-600">
                  {perText}
                </span>
              </p>
              <div className="flex items-center space-x-3 mt-1">
                <span className="text-sm font-medium text-gray-500">
                  Launch price:
                </span>
                {/* Launch Price (Crossed out) */}
                <span className="text-base line-through font-semibold text-gray-500">
                  ₦ 15,000
                </span>
              </div>
            </div>
          </div>

          {/* Features List */}
          <p className="text-sm text-gray-600 mb-6 border-t pt-6 border-gray-200">
            Each counsel gets full access to:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {features.map((feature, index) => (
              <motion.div
                variants={fadeInSlideUp}
                key={index}
                className="flex items-center space-x-3"
              >
                <Check
                  className="w-5 h-5 text-violet-600 shrink-0"
                  aria-hidden="true"
                />
                <span className="text-base text-gray-700">{feature}</span>
              </motion.div>
            ))}
          </div>

          <div className="pt-6 border-t border-gray-200">
            <Link href="/role">
              <Button
                variant="default"
                className="w-full justify-center bg-violet-600"
              >
                Get started
              </Button>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default PricingSection;
