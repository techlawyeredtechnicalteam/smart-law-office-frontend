"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { RoleCard } from "@/components/auth/UserRoleCard";
import { motion, Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};
const fadeInSlideUp: Variants = {
  hidden: { y: 30, opacity: 0 },
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

const cardContainerVariant: Variants = {
  hidden: { y: 50, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 15
    }
  }
};

const UserRole = () => {
  const router = useRouter();

  const handleRoleSelect = (role: "CLIENT" | "COUNSEL") => {
    // setRole(role);
    if (role === "CLIENT") {
      router.push("/client/signup");
    } else {
      router.push("/admin/signup");
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen flex flex-col items-center justify-start pt-0 bg-white"
    >
      {/* Top color logo area */}
      <motion.div
        variants={containerVariants}
        className="w-full bg-[#7C3AED] text-white pt-16 pb-48 px-4 text-center shadow-lg"
      >
        <motion.h1
          variants={fadeInSlideUp}
          className="text-3xl font-semibold mb-1"
        >
          Logo
        </motion.h1>
        <motion.h2
          variants={fadeInSlideUp}
          className="text-5xl font-extrabold mt-8"
        >
          What&apos;s your goal?
        </motion.h2>
      </motion.div>

      {/* Card Container */}
      <motion.div
        variants={cardContainerVariant}
        className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-12 -mt-32 max-w-5xl mx-auto p-4 relative z-10"
      >
        {/* Client Card */}
        <RoleCard
          title="As a Client"
          description="Connect with your lawyer, track your case progress, upload documents, and communicate securely."
          iconSrc="/client-user-role.png"
          role="client"
          activeColor="blue"
          onClick={() => handleRoleSelect("CLIENT")}
        />
        {/* LawFirm/Counsel Card */}
        <RoleCard
          title="As a Law Firm/Counsel"
          description="Set up your smart law office, customise your brand, onboard counsels, and manage all cases and clients from one unified workspace."
          iconSrc="/firm-user-role.png"
          role="lawyer"
          activeColor="violet"
          onClick={() => handleRoleSelect("COUNSEL")}
        />
      </motion.div>

      {/* Footer Links */}
      <motion.div
        variants={fadeInSlideUp}
        className="mt-16 text-center text-sm text-gray-600 px-4"
      >
        By signing up, you agree to the{" "}
        <a href="#" className="font-semibold text-[#7C3AED] hover:underline">
          Terms of service
        </a>
        , and{" "}
        <a href="#" className="font-semibold text-[#7C3AED] hover:underline">
          Privacy policy
        </a>
        .
      </motion.div>
      <motion.div
        variants={fadeInSlideUp}
        className="mt-4 mb-10 text-center text-sm text-gray-600 px-4"
      >
        Already have an account?{" "}
        <a href="/admin/login" className="font-semibold text-[#7C3AED] hover:underline">
          Sign in
        </a>
      </motion.div>
    </motion.div>
  );
};

export default UserRole;
