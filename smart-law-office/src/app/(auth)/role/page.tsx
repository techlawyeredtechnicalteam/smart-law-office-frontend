"use client";

import React from "react";
import { useAuthStore } from "@/store/authStore";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface RoleCardProps {
  title: string;
  description: string;
  iconSrc: string;
  role: string;
  activeColor: string;
  onClick: () => void;
}

const UserRole = () => {
  const { setRole } = useAuthStore();
  const router = useRouter();

  const handleRoleSelect = (role: "client" | "lawyer") => {
    setRole(role);
    if (role === "client") {
      router.push("/client/sign-up");
    } else {
      router.push("/firm/sign-up");
    }
  };

  //component for each role
  const RoleCard: React.FC<RoleCardProps> = ({
    title,
    description,
    iconSrc,
    role,
    activeColor,
    onClick
  }) => (
    <div
      onClick={onClick}
      className={`relative cursor-pointer p-8 sm:p-10 bg-violet-50 rounded-3xl shadow-xl transition-all duration-300 transform hover:scale-[0.98] flex flex-col items-center text-center max-w-sm w-full`}
    >
      {/* placeholder for the top right radio buttion */}
      <div
        className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center`}
      >
        <div className="w-2 h-2 rounded-full bg-white"></div>
      </div>

      {/* Placeholder for Image Icon */}
      <div className="relative w-20 h-20 mb-6">
        <Image src={iconSrc} alt={title} fill className="object-contain" />
      </div>
      <h3
        className={`text-xl font-bold mt-4 mb-2 ${
          activeColor === "blue" ? "text-violet-700" : "text-[#7C3AED]"
        }`}
      >
        {title}
      </h3>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-0 bg-white">
      {/* Top color logo area */}
      <div className="w-full bg-[#7C3AED] text-white pt-16 pb-48 px-4 text-center shadow-lg">
        <h1 className="text-3xl font-semibold mb-1">Logo</h1>
        <h2 className="text-5xl font-extrabold mt-8">What&apos;s your goal?</h2>
      </div>

      {/* Card Container */}
      <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-12 -mt-32 max-w-5xl mx-auto p-4 relative z-10">
        {/* Client Card */}
        <RoleCard
          title="As a Client"
          description="Connect with your lawyer, track your case progress, upload documents, and communicate securely."
          iconSrc="/client-user-role.png"
          role="client"
          activeColor="blue"
          onClick={() => handleRoleSelect("client")}
        />
        {/* LawFirm/Counsel Card */}
        <RoleCard
          title="As a Law Firm/Counsel"
          description="Set up your smart law office, customise your brand, onboard counsels, and manage all cases and clients from one unified workspace."
          iconSrc="/firm-user-role.png"
          role="lawyer"
          activeColor="violet"
          onClick={() => handleRoleSelect("lawyer")}
        />
      </div>

      {/* Footer Links */}
      <div className="mt-16 text-center text-sm text-gray-600 px-4">
        By signing up, you agree to the{" "}
        <a href="#" className="font-semibold text-[#7C3AED] hover:underline">
          Terms of service
        </a>
        , and{" "}
        <a href="#" className="font-semibold text-[#7C3AED] hover:underline">
          Privacy policy
        </a>
        .
      </div>
      <div className="mt-4 mb-10 text-center text-sm text-gray-600 px-4">
        Already have an account?{" "}
        <a href="#" className="font-semibold text-[#7C3AED] hover:underline">
          Sign in
        </a>
      </div>
    </div>
  );
};

export default UserRole;
