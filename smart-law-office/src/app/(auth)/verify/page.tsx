"use client";
import VerifyForm from "@/components/auth/VerifyForm";
import { useSearchParams } from "next/navigation";

export default function VerifyPage() {
  const params = useSearchParams();
  const userIdFromQuery = params.get("email") || "";

  return (
    <div className="flex flex-col h-full p-8 lg:p-16 justify-center">
      <div className="max-w-lg mx-auto w-full">
        <h1 className="text-5xl font-bold mb-4">We emailed you a code</h1>
        <p className="text-lg text-gray-700 mb-8">
          A Verification code was sent to <strong>{userIdFromQuery}</strong>.
          Enter the code below.
        </p>
      </div>

      {/* VerifyForm */}
      <VerifyForm />
    </div>
  );
}
