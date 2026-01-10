import { Metadata } from "next";
import LoginForm from "@/components/auth/admin/LoginForm";
import { CheckCircle } from "lucide-react";
import UnifiedLoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign In - Smart Law Office"
};

export default function LoginPage() {
  return (
    <div className="flex flex-col space-y-6 w-full max-w-lg mx-auto p-4 sm:p-0">
      {/* Welcome Text Header */}
      <header className="space-y-2">
        <h1 className="text-3xl font-light">
          Welcome to <br />
          <span className="text-3xl font-bold text-[#7C3AED]">
            Smart Law Office
          </span>
        </h1>
      </header>

      {/* Role Indicator: "As a Counsel" */}
      <div className="flex items-center text-lg font-medium text-gray-700">
        <CheckCircle className="w-5 h-5 mr-2 text-[#7C3AED]" />{" "}
        {/* Using a suitable icon */}
        As a Counsel/Firm
      </div>

      {/* The Login Form */}
      <UnifiedLoginForm />
    </div>
  );
}
