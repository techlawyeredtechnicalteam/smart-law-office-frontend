"use client";
import React from "react";
import { motion, Variants } from "framer-motion";
import {
  sectionStaggerContainer,
  fadeInSlideUp
} from "@/utils/landing-animation";

const featureCardVariant: Variants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20
    }
  }
};

const FeatureCard: React.FC<{
  number: number;
  title: string;
  description: string;
}> = ({ number, title, description }) => (
  <motion.div
    variants={featureCardVariant}
    className="bg-violet-50 p-8 rounded-2xl shadow-xl flex flex-col h-full text-left"
  >
    <div className="w-10 h-10 flex items-center justify-center border-solid rounded-sm border-2 border-violet-300 text-violet-700 text-lg font-bold mb-4 shadow-md">
      {number}
    </div>
    <h3 className="text-xl font-semibold text-violet-700 mb-3">{title}</h3>
    <p className="text-black text-base grow">{description}</p>
  </motion.div>
);

export const FeaturesSection: React.FC = () => (
  <section
    id="features"
    className="scroll-mt-24 py-20 md:py-32 bg-linear-to-b from-gray-200 via-slate-100 to-violet-100"
  >
    <motion.div
      variants={sectionStaggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 text-center"
    >
      <motion.div variants={fadeInSlideUp} className="inline-block mb-6">
        <span className="px-4 py-2 bg-violet-100 border-2 border-violet-300 rounded-full text-sm uppercase tracking-wider text-black mb-2">
          What you gain
        </span>
      </motion.div>
      <motion.h2
        variants={fadeInSlideUp}
        className="text-4xl md:text-5xl font-extrabold mb-2 text-black tracking-widest"
      >
        Features
      </motion.h2>
      <motion.p
        variants={fadeInSlideUp}
        className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto"
      >
        A unified platform that empowers law firm to manage operations, counsels
        to work efficiently, and clients to access legal services with ease
      </motion.p>

      <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard
          number={1}
          title="As Client"
          description="Manage consultations, documents, case updates, and payments, all from your personalized client dashboard."
        />
        <FeatureCard
          number={2}
          title="As Counsel"
          description="Manage assigned cases, notes, documents, and communication in one secure, counsel dashboard."
        />
        <FeatureCard
          number={3}
          title="As Law Firm"
          description="Set up your smart law office, customise your brand, onboard counsel, and manage all cases and clients from one unified workspace."
        />
      </motion.div>
    </motion.div>
  </section>
);
