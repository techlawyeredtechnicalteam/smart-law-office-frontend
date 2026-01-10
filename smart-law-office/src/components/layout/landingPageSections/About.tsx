"use client";

import {
  DocumentCardMockup,
  MonthlyFinancialOverview
} from "../../helper/associatedDocument";
import {
  sectionStaggerContainer,
  fadeInSlideUp
} from "@/utils/landing-animation";
import { motion, Variants } from "framer-motion";

const imageSlideIn: Variants = {
  hidden: { x: -50, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 15,
      delay: 0.3
    }
  }
};

export const AboutSection: React.FC = () => (
  <section
    id="about"
    className="scroll-mt-24 pt-32 md:pt-40 lg:pt-32 pb-20 md:pb-32 bg-linear-to-b from-gray-200 via-slate-100 to-violet-100"
  >
    <motion.div
      variants={sectionStaggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-y-12 lg:gap-x-24 items-center"
    >
      {/* Left Column: Mockups */}
      <motion.div
        variants={imageSlideIn}
        className="relative p-4 order-2 lg:order-1 flex flex-col items-center mb-8 lg:mb-0 lg:pb-48 lg:pt-2"
      >
        {/* Associated Documents*/}
        <DocumentCardMockup showButton={true} />

        {/* Monthly Financial Overview: Adjusted lg:top to ensure proper overlap distance */}
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { delay: 0.5 } }
          }}
          className="relative z-0 max-w-sm w-full lg:absolute lg:top-56 lg:left-1/2 lg:-translate-x-1/4"
        >
          <MonthlyFinancialOverview />
        </motion.div>
      </motion.div>

      {/* Right Column: Text */}
      <div className="order-1 lg:order-2">
        <div className="max-w-xl">
          <motion.div variants={fadeInSlideUp} className="inline-block mb-6">
            <span className="px-6 py-2 bg-violet-50 border-2 border-violet-300 rounded-full text-sm font-bold uppercase tracking-wider text-violet-400 mb-2">
              Empowering Legal Practice
            </span>
          </motion.div>
          <motion.h2
            variants={fadeInSlideUp}
            className="text-4xl md:text-5xl font-extrabold mb-6"
          >
            About us
          </motion.h2>
          <motion.p
            variants={fadeInSlideUp}
            className="text-lg text-gray-400 leading-relaxed max-w-lg"
          >
            Smart Law Office combines legal expertise and technology to deliver
            a complete virtual practice solution. We help firms digitize
            operations while maintaining compliance, professionalism, and
            top-tier service delivery.
          </motion.p>
        </div>
      </div>
    </motion.div>
  </section>
);
