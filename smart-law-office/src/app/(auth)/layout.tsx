"use client";

import { usePathname } from "next/navigation";
import React from "react";

const PagesLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  // full screen for acct and user role
  // const isFullScreen = pathname === "/firm/success" || pathname === "/role";

  // Routes with full-screen layout
  const fullScreenRoutes = ["/success", "/role"];

  // Routes with two-pane layout
  const twoPaneRoutes = [
    // Firm Routes
    "/sign-up",
    "/signup",
    "/login",

    // Firm Profile Routes
    "/firm-profile"
  ];

  // check if current path is full screen
  const isFullScreen = fullScreenRoutes.includes(pathname);

  // check if current path should have two pane
  const isTwoPane = twoPaneRoutes.some((route) => pathname.includes(route));

  // Full screen layout
  if (isFullScreen) {
    return <div className="min-h-screen">{children}</div>;
  }

  // two pane layout
  if (twoPaneRoutes) {
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
  }

  // default layout (if needed)
  return <div className="min-h-screen">{children}</div>;
};

export default PagesLayout;
