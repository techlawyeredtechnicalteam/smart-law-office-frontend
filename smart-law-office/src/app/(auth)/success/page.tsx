"use client";

import { useAuthStore } from "@/store/authStore";
import { CheckCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const Dot: React.FC<{ delay?: string }> = ({ delay }) => (
  <div
    className="w-3 h-3 mx-1 rounded-full bg-[#7C3AED] animate-pulse"
    style={{ animationDelay: delay }}
  ></div>
);
const SuccessPage = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isFinishing, setIsFinishing] = React.useState<boolean>(true);

  React.useEffect(() => {
    // simulate acct delay
    const timer = setTimeout(() => {
      setIsFinishing(false);

      // Redirect after short delay
      setTimeout(() => {
        router.push("/admin/cases");
      }, 1500);
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-violet-50">
      <div className="flex mb-8">
        <Dot delay="0s" />
        <Dot delay="0.2s" />
        <Dot delay="0.4s" />
      </div>

      <p className="textlg font-medium text-gray-800">
        {isFinishing
          ? "Creating your account"
          : `Account created successfully ${
              user?.email ? `, ${user?.email}` : ""
            }!`}
      </p>

      {/* placeholder for visual  */}
      <div
        className="mt-16 w-11/12 max-w-lg h-64 rounded-2xl transition-all duration-500"
        style={{
          backgroundColor: isFinishing
            ? "rgba(124, 58, 237, 0.1)"
            : "rgba(16, 185, 129, 0.1)",
          border: isFinishing
            ? "2px solid rgba(124, 58, 237, 0.2)"
            : "2px solid rgba(16, 185, 129, 0.2)"
        }}
      >
        <div className="flex flex-col items-center justify-center h-full">
          {isFinishing ? (
            <Loader2 className="w-10 h-10 text-[#7C3AED] animate-spin" />
          ) : (
            <div className="flex flex-col items-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
              <p className="text-gray-600">Redirecting you now...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
