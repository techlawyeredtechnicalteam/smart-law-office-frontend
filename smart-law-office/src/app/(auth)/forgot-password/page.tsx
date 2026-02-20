"use client";

import ForgotPassword from "@/components/auth/forgotPassword/ForgotPassword";
import { useForgotPasswordStore } from "@/store/forgotPasswordStore";

const ForgotPasswordPage = () => {
  const { email } = useForgotPasswordStore();

  return (
    <div className="max-w-lg mx-auto w-full space-y-8">
      <h1 className="text-3xl font-bold">Forgot Password</h1>
      <p className="text-base text-gray-400">
        Enter your email for the verification process. We'll send a verification
        code to {email || "your email"}
      </p>

      <ForgotPassword />
    </div>
  );
};

export default ForgotPasswordPage;
