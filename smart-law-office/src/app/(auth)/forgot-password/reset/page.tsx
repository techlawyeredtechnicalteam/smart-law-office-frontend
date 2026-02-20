import ResetPassword from "@/components/auth/forgotPassword/ResetPassword";
import { Loader2 } from "lucide-react";
import React, { Suspense } from "react";

const ResetPasswordPage = () => {
  return (
    <div className="flex flex-col h-full p-8 lg:p-16 justify-center">
      <div className="max-w-lg mx-auto w-full">
        <h1 className="text-5xl font-bold mb-4">Set up new Password</h1>
        <p className="text-lg text-gray-700 mb-8">
          Set a new password for your account so you can log in to access all
          features
        </p>
      </div>
      {/* <ResetPassword /> */}
      <Suspense
        fallback={
          <div className="flex justify-center p-8">
            <Loader2 className="animate-spin text-violet-600" />
          </div>
        }
      >
        <ResetPassword />
      </Suspense>
    </div>
  );
};

export default ResetPasswordPage;
