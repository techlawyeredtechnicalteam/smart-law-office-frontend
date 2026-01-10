"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import {
  sectionStaggerContainer,
  fadeInSlideUp
} from "@/utils/landing-animation";

const footerItemVariant: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

export const Footer: React.FC = () => (
  <motion.footer
    variants={sectionStaggerContainer}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.3 }}
    className="bg-violet-500 pt-16 pb-8 text-white"
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 border-b border-violet-800 pb-12">
        {/* Logo & Contact */}
        <div className="col-span-2 lg:col-span-2 space-y-3">
          <motion.div
            variants={footerItemVariant}
            className="text-xl font-bold tracking-widest text-violet-300"
          >
            Logo
          </motion.div>
          <p className="text-lg font-semibold">Smart Law Office</p>
          <p className="text-sm text-violet-200">+234 908 809 9848</p>
        </div>

        {/* Links */}
        <motion.div variants={footerItemVariant} className="space-y-3">
          <h5 className="font-semibold uppercase text-white text-sm mb-4">
            Links
          </h5>
          <ul className="space-y-2 text-sm">
            <motion.li variants={footerItemVariant}>
              <a href="#about" className="hover:text-violet-400 transition">
                About
              </a>
            </motion.li>
            <motion.li variants={footerItemVariant}>
              <a href="#features" className="hover:text-violet-400 transition">
                Features
              </a>
            </motion.li>
            <motion.li variants={footerItemVariant}>
              <a href="#" className="hover:text-violet-400 transition">
                Resources
              </a>
            </motion.li>
            <motion.li variants={footerItemVariant}>
              <a href="#pricing" className="hover:text-violet-400 transition">
                Pricing
              </a>
            </motion.li>
          </ul>
        </motion.div>

        {/* Legal Information */}
        <motion.div variants={footerItemVariant} className="space-y-3">
          <h5 className="font-semibold uppercase text-white text-sm mb-4">
            Legal Information
          </h5>
          <ul className="space-y-2 text-sm">
            <motion.li variants={footerItemVariant}>
              <a href="#" className="hover:text-violet-400 transition">
                Privacy policy
              </a>
            </motion.li>
            <motion.li variants={footerItemVariant}>
              <a href="#" className="hover:text-violet-400 transition">
                Terms of service
              </a>
            </motion.li>
            <motion.li variants={footerItemVariant}>
              <a href="#" className="hover:text-violet-400 transition">
                Contact us
              </a>
            </motion.li>
          </ul>
        </motion.div>
      </div>

      {/* Copyright */}
      <motion.div
        variants={footerItemVariant}
        className="pt-8 text-center md:text-left"
      >
        <p className="text-xs text-violet-200">
          © Smart Law Office. All Rights Reserved.
        </p>
      </motion.div>
    </div>
  </motion.footer>
);
