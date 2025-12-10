import { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign In - Smart Law Office"
};

export default function LoginPage() {
  return (
    <div className="flex flex-col h-full p-8 lg:p-16">
      <div className="w-12 h-12 bg-gray-200 rounded-full border border-gray-300 flex items-center justify-center">
        <span className="text-xs text-gray-700">USLEGAL</span>
      </div>

      {/* Welcome Text */}
      <hgroup className="spsace-y-1">
        <h2 className="text-xl font-medium text-gray-800">Welcome to</h2>
        <h1 className="text-4xl font-extrabold text-[#7C3AED]">
          Smart Law Office
        </h1>
      </hgroup>

      {/* Role Indicator */}
      <div className="flex items-center space-x-2 text-lg text-gray-700 font-semibold pt-4">
        <div className="w-3 h-3 rounded-full bg-[#7C3AED]" />
        <span>As a Counsel</span>
      </div>

      {/* The Login Form */}
      <LoginForm />
    </div>
  );
}
