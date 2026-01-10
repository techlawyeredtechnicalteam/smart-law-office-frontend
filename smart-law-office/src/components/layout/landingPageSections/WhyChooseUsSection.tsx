"use client";

import { Check } from "lucide-react";
import { Button } from "../../ui/button";
import React from "react";
import Image from "next/image";
import { DocumentCardMockup } from "../../helper/associatedDocument";
import { motion, Variants } from "framer-motion";
import {
  sectionStaggerContainer,
  fadeInSlideUp
} from "@/utils/landing-animation";

const blockSlideIn: (isLeft: boolean) => Variants = (isLeft) => ({
  hidden: { x: isLeft ? -100 : 100, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 15,
      delay: 0.1
    }
  }
});

export interface WhyChooseUsBlockProps {
  title: string;
  description: string;
  features: string[];
  imageSide: "left" | "right";
  imagePlaceholder: React.ReactNode;
}

const WhyChooseUsBlock: React.FC<WhyChooseUsBlockProps> = ({
  title,
  description,
  features,
  imageSide,
  imagePlaceholder
}) => {
  const isImageLeft = imageSide === "left";
  // Base classes for alternating layout
  const contentOrder = isImageLeft ? "lg:order-2" : "lg:order-1";
  const imageOrder = isImageLeft ? "lg:order-1" : "lg:order-2";

  return (
    <motion.div
      variants={blockSlideIn(isImageLeft)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center py-16 text-left overflow-hidden"
    >
      {/* Image Placeholder Column */}
      <motion.div
        initial={{ scale: 0.8 }}
        whileInView={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 50 }}
        viewport={{ once: true, amount: 0.3 }}
        className={`relative ${imageOrder} flex justify-center items-center h-80 lg:h-96 w-full p-4`}
      >
        {imagePlaceholder}
      </motion.div>

      {/* Text Content Column */}
      <div className={contentOrder}>
        <h3 className="text-3xl md:text-4xl font-bold mb-4 text-black">
          {title}
        </h3>
        <p className="text-lg text-gray-800 mb-6">{description}</p>
        <ul className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <li
              key={index}
              className="flex items-start space-x-3 text-gray-800"
            >
              <Check className="w-5 h-5 text-violet-500 shrink-0 mt-1" />
              <span className="text-base">{feature}</span>
            </li>
          ))}
        </ul>
        <Button variant="default" className="bg-violet-600">
          Learn More
        </Button>
      </div>
    </motion.div>
  );
};

export const WhyChooseUsSection: React.FC = () => {
  return (
    <section
      id="why-choose-us"
      className="scroll-mt-24 py-20 md:py-32 bg-gray-100 relative"
    >
      {/* Image overlay */}
      <div className="absolute inset-0 z-0 opacity-20">
        <Image
          src="/Why choose us.png"
          alt="Background image"
          layout="fill"
          objectFit="cover"
          objectPosition="center"
        />
      </div>
      <motion.div
        variants={sectionStaggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 text-center relative z-10"
      >
        <motion.div variants={fadeInSlideUp} className="inline-block mb-6">
          <span className="px-6 py-2 bg-violet-100 text-xs font-bold uppercase tracking-widest text-black mb-2 p-1 border border-violet-500 inline-block rounded-full">
            DESIGNED FOR YOU
          </span>
        </motion.div>
        <motion.h2
          variants={fadeInSlideUp}
          className="text-4xl md:text-5xl font-extrabold mb-4 text-black"
        >
          Why choose us
        </motion.h2>
        <motion.p
          variants={fadeInSlideUp}
          className="text-lg text-gray-800 mb-16 max-w-3xl mx-auto"
        >
          We offer practical, scalable, and affordable legal technology designed
          for everyday practice, with features tailored to drive results for
          you.
        </motion.p>

        {/* Block 1: Smart Practice Management */}
        <WhyChooseUsBlock
          title="Smart Practice Management"
          description="Efficient tools for managing clients, cases, and daily legal workflows."
          features={[
            "Create clients, assign IDs, convert consultations to clients.",
            "Create cases, track notes, assign counsel, monitor adjournment dates.",
            "Generate invoices, track payments, download receipts."
          ]}
          imageSide="left"
          imagePlaceholder={
            <div className="relative w-full h-full max-w-lg mx-auto">
              {/* Placeholder for Image 1 */}
              <Image
                src="/Smart.png"
                alt="A lawyer reviewing digital documents on a floating interface."
                className="w-full h-full object-cover rounded-xl shadow-2xl"
                fill
              />
              {/* Document Mockup Card */}
              <div className="absolute bottom-4 right-4 md:bottom-10 md:right-10 hidden md:block z-10">
                <DocumentCardMockup showButton={false} />
              </div>
            </div>
          }
        />

        {/* Block 2: Multi-Role Workspaces */}
        <WhyChooseUsBlock
          title="Multi-Role Workspaces"
          description="Personalized dashboards that align with the needs of every participant in the legal process."
          features={[
            "Brand setup, add counsel, set consultation fees, manage operations.",
            "View assigned cases, update notes, upload documents, manage communication.",
            "Book consultations, view case progress, upload documents, track payments."
          ]}
          imageSide="right"
          imagePlaceholder={
            <div className="relative w-full h-full max-w-lg mx-auto">
              {/* Placeholder for Image 2 */}
              <Image
                src="/Smart (1).png"
                alt="A team of legal professionals collaborating in an office."
                className="w-full h-full object-cover rounded-xl shadow-2xl"
                fill
              />
              {/* Document Mockup Card */}
              <div className="absolute bottom-4 left-4 md:bottom-10 md:left-10 hidden md:block z-10">
                <DocumentCardMockup showButton={false} />
              </div>
            </div>
          }
        />

        {/* Block 3: Secure Communication & Collaboration */}
        <WhyChooseUsBlock
          title="Secure Communication & Collaboration"
          description="Modern tools that keep firms, counsels, and clients connected."
          features={[
            "In-app chats between clients and counsel.",
            "Prompt updates on case changes, payments, and communications.",
            "Timestamped notes and updates for transparency and record-keeping."
          ]}
          imageSide="left"
          imagePlaceholder={
            <div className="relative w-full h-full max-w-lg mx-auto">
              {/* Placeholder for Image 3 */}
              <Image
                src="/Smart (2).png"
                alt="A close-up of two people looking at a digital tablet with legal documents."
                className="w-full h-full object-cover rounded-xl shadow-2xl"
                fill
              />
              {/* Document Mockup Card */}
              <div className="absolute bottom-4 right-4 md:bottom-10 md:right-10 hidden md:block z-10">
                <DocumentCardMockup showButton={false} />
              </div>
            </div>
          }
        />
      </motion.div>
    </section>
  );
};
