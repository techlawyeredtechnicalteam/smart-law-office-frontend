"use client";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { CheckCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const Dot: React.FC = () => (
  <div
    className="w-3 h-3 mx-1 rounded-full bg-[#7C3AED] animate-pulse"
    style={{ animationDelay: "0.3s" }}
  ></div>
);
const CreateAcct = () => {
  const router = useRouter();
  const { checkAuth, resetSignupFlow } = useAuthStore();
  const [isFinishing, setIsFinishing] = React.useState<boolean>(true);
  const [showSuccess, setShowSuccess] = React.useState<boolean>(false);

  React.useEffect(() => {
    // simulate the BE process time
    const finalize = async () => {
      try {
        // finalize the acct set up
        await checkAuth();
        setIsFinishing(false);
        setTimeout(() => {
          setShowSuccess(true);

          // auto redirect 3s
          setTimeout(() => {
            router.push("/");
          }, 3000);
        }, 1000);
      } catch (error) {
        console.error("Account creation failed:", error);
        alert("Final account creation failed. Resetting flow.");
        router.push("/sign-up");
      }
    };
    finalize();
  }, [checkAuth, router]);

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center bg-violet-50">
        <div className="animate-scale-in mb-6">
          <CheckCircle className="w-16 h-16 text-green-600 mb-4" size={48} />
        </div>

        <h2 className="text-3xl font-semibold mb-2">
          Account Created Successfully!
        </h2>

        <p className="text-gray-700 mb-6">Welcome to Smart Law Office</p>

        {/* redirect to dashboard */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-gray-50">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Redirecting to Dashboard...</span>
          </div>
        </div>

        <Button
          onClick={resetSignupFlow}
          className="px-6 py-2 bg-violet-600 text-white rounded hover:bg-violet-700 transition"
        >
          Go to Dashobard (Mock Reset)
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-violet-50">
      <div className="flex mb-8">
        <Dot />
        <Dot />
        <Dot />
      </div>
      <p className="textlg font-medium text-gray-800">
        {isFinishing
          ? "Creating your account"
          : "Account created successfully!"}
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
            <CheckCircle className="w-10 h-10 text-green-600" />
          )}
          <p className="mt-4 text-gray-600">
            {isFinishing
              ? "Please wait, this may take a moment."
              : "Redirecting you now..."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateAcct;
