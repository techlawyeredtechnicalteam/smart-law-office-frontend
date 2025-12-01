"use client";

import { usePathname } from "next/navigation";
import React from "react";

const authLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  // full screen for acct and user role
  const isFullScreen = pathname === "/firm/success" || pathname === "/role";

  // Routes with full-screen layoit
  const fullScreenRoutes = ["/firm/success", "/role"];

  // Routes with two-pane layout
  const fivePaneRoutes = [
    // Firm Routes
    "/client/sign-up",
    "/firm/sign-up",

    // Firm Profile Routes
    "/firm-profile/step-1",
    "/firm-profile/step-2",
    "/firm-profile/step-3",
    "/firm-profile/step-4",
    "/firm-profile/step-5"
  ];

  if (isFullScreen) {
    return <div className="min-h-screen">{children}</div>;
  }

  // 5 two routes
  return (
    <div className="flex min-h-screen">
      {/* Left Pane (Content) */}
      <div className="flex-1 bg-white flex items-center justify-center p-4 sm:p-8 lg:p-0">
        <div className="w-full max-w-xl">{children}</div>
      </div>

      {/* Right Pane (Aesthetic/Branding) - Fixed purple color */}
      <div className="hidden lg:block lg:w-1/2 bg-[#7C3AED] min-h-screen"></div>
    </div>
  );
};

export default authLayout;
