"use client";

import { usePathname } from "next/navigation";
import React from "react";

const PagesLayout = ({ children }: { children: React.ReactNode }) => {
  // const pathname = usePathname();

  // Routes with two-pane layout
  const twoPaneRoutes = [
    // Firm Profile Routes
    "/firm-profile"
  ];

  // two pane layout
  if (twoPaneRoutes) {
    return (
      <div className="flex min-h-screen">
        {/* Left Pane (Content) */}
        <div className="flex-1 bg-white flex items-center justify-center p-4 sm:p-8 lg:p-0">
          <div className="w-full max-w-xl p-8">{children}</div>
        </div>

        {/* Right Pane (Aesthetic/Branding) - Fixed purple color */}
        <div className="hidden lg:block lg:w-1/2 bg-[#7C3AED] min-h-screen"></div>
      </div>
    );
  }
};

export default PagesLayout;
