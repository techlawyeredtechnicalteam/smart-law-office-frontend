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
    // If user is null, the store might still be hydrating from localStorage
    if (!user && isFinishing) return;

    const timer = setTimeout(() => {
      setIsFinishing(false);

      const getTargetRoute = () => {
        if (!user) return "/role"; // Final fallback

        switch (user.role) {
          case "ADMIN":
          case "STAFF":
            return "/admin/dashboard";
          case "CLIENT":
            return "/client/manage-case";
          default:
            return "/role";
        }
      };

      setTimeout(() => {
        router.push(getTargetRoute());
      }, 1500);
    }, 2000);

    return () => clearTimeout(timer);
  }, [router, user, isFinishing]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-violet-50">
      <div className="flex mb-8">
        <Dot delay="0s" />
        <Dot delay="0.2s" />
        <Dot delay="0.4s" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">
          {isFinishing ? "Finalizing your workspace" : "Welcome aboard!"}
        </h1>
        <p className="text-gray-600 max-w-xs mx-auto">
          {isFinishing
            ? "We're setting up your legal tools and secure environment."
            : `Your account (${user?.email}) is ready to go.`}
        </p>
      </div>

      {/* placeholder for visual  */}
      <div
        className="mt-12 w-full max-w-sm h-48 rounded-2xl transition-all duration-700 flex flex-col items-center justify-center border shadow-sm"
        style={{
          backgroundColor: isFinishing ? "white" : "rgba(16, 185, 129, 0.05)",
          borderColor: isFinishing ? "#E5E7EB" : "rgba(16, 185, 129, 0.2)"
        }}
      >
        {isFinishing ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 text-[#7C3AED] animate-spin" />
            <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">
              Securing Database
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center animate-in zoom-in duration-500">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-sm font-medium text-green-700">
              Redirecting to Dashboard...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuccessPage;
