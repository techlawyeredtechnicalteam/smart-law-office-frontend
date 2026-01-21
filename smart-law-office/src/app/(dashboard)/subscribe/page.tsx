"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// This tells Next.js to skip Prerendering for the content
const SubscriptionContent = dynamic(() => import("./SubscriptionContent"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-[#6f42c1]" />
        {/* <p className="text-gray-500 font-medium animate-pulse">
          Loading your subscription portal...
        </p> */}
      </div>
    </div>
  )
});

export default function SubscriptionPage() {
  return <SubscriptionContent />;
}
