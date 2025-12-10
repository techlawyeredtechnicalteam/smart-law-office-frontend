"use client";

import React from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { RoleCard } from "@/components/auth/UserRoleCard";

const UserRole = () => {
  const { setRole } = useAuthStore();
  const router = useRouter();

  const handleRoleSelect = (role: "client" | "lawyer") => {
    setRole(role);
    if (role === "client") {
      router.push("/signup-client");
    } else {
      router.push("/signup");
    }
  };

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
        <a
          href="/login"
          className="font-semibold text-[#7C3AED] hover:underline"
        >
          Sign in
        </a>
      </div>
    </div>
  );
};

export default UserRole;
