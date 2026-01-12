import { Metadata } from "next";
import { CheckCircle } from "lucide-react";
import UnifiedLoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign In - Smart Law Office"
};

export default function LoginPage() {
  return (
    <div className="flex flex-col w-full max-w-xl mx-auto p-4">
      {/* Welcome Text Header */}
      <header className="space-y-2">
        <h1 className="text-3xl font-light">Welcome to back</h1>
      </header>
      {/* The Login Form */}
      <UnifiedLoginForm />
    </div>
  );
}
