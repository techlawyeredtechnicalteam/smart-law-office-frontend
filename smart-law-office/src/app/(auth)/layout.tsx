"use client";

import { Star, User } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";

const PagesLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  // Routes with full-screen layout
  const fullScreenRoutes = ["/success", "/role"];

  // Routes with two-pane layout
  const twoPaneRoutes = [
    // Firm Routes
    "/admin/signup",
    "/admin/login",
    "/client/signup",
    "/client/login",
    "/verify",

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
  if (isTwoPane) {
    return (
      <div className="flex h-screen overflow-hidden">
        {/* Left Pane (Content) */}
        <div className="flex-1 bg-gray-100 flex items-center justify-center p-4 sm:p-8 lg:p-16">
          <div className="w-full">{children}</div>
        </div>

        {/* Right Pane (Aesthetic/Branding) */}
        <div className="hidden lg:block lg:w-1/2 bg-[#7C3AED] p-8 xl:p-14 relative">
          <div className="flex flex-col justify-between min-h-full text-white">
            {/* Title and Description */}
            <header className="pt-6 xl:pt-10">
              <h1 className="text-3xl xl:text-4xl font-extrabold leading-tight">
                Everything You Need to Run a Modern Law Office.
              </h1>
              <p className="mt-4 xl:mt-6 text-lg xl:text-xl text-white/90">
                Manage cases, documents, and client communication in one
                intuitive platform, built to simplify your workflow.
              </p>
            </header>

            {/* Testimonial Block */}
            <div className="bg-white/10 p-4 xl:p-6 rounded-lg max-w-full mb-6 xl:mb-8">
              <div className="flex justify-end">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  {/* Using a simple User icon for the avatar */}
                  <User className="w-5 h-5 text-[#7C3AED]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">I am wowed!</h3>
                </div>
              </div>
              <blockquote className="italic border-l-4 border-white pl-4 text-white/95 text-base">
                &quot;Everything I need is in one place. Tracking cases and
                deadlines has become unbelievably easy.&quot;
              </blockquote>
              <p className="mt-3 text-sm font-semibold text-white/70">
                Michael Lawson
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // default layout (if needed)
  return <div className="min-h-screen">{children}</div>;
};

export default PagesLayout;
