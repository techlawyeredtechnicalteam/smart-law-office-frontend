import React from "react";

const authLayout = ({ children }: { children: React.ReactNode }) => {
  // Default two-pane layout for steps 1 and 2
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
