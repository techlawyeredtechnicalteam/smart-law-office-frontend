"use client";
import { useAuthStore } from "@/store/authStore";
import React from "react";
import { userName } from "./Sidebar";
import { X } from "lucide-react";
import NavLinks from "../../layout/SmartNavLink";

type MobileDrawerProps = {
  isDrawerOpen: boolean;
  closeDrawer: () => void;
};

const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isDrawerOpen,
  closeDrawer
}) => {
  const { user, currentPath, setCurrentPath } = useAuthStore();
  const userNameValue = userName(user);
  const userInitials =
    userNameValue
      ?.split(" ")
      .map((n: string) => n[0])
      .join("") || "U";

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          isDrawerOpen ? "opacity-50" : "opacity-0 pointer-events-none"
        } lg:hidden bg-black`}
        onClick={closeDrawer}
      ></div>

      {/* Drawer Content */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-violet-900 text-white z-50 transition-transform duration-300 transform ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        } lg:hidden shadow-2xl`}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex justify-between items-center py-4 mb-4 border-b border-violet-700">
            <h1 className="text-xs font-bold text-white flex items-center">
              Smart Law Office Legal
            </h1>
            <button
              type="button"
              aria-label="Close Drawer"
              onClick={closeDrawer}
              className="p-2 rounded-lg hover:bg-violet-700 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="bg-violet-600 p-3 rounded-xl shadow-md mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-lg font-bold text-violet-700">
                {userInitials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">
                  {userNameValue}
                </p>
                <p className="text-[10px] text-violet-200 break-all pt-1">
                  ID: {user?.id || "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="grow pr-1">
            {<NavLinks closeDrawer={closeDrawer} />}
          </div>

          <div className="mt-8 pt-4">
            <div className="p-4 bg-violet-800 rounded-xl text-center shadow-inner">
              <p className="text-sm font-semibold text-violet-200 mb-2">
                Cynt AI
              </p>
              <button
                type="button"
                className="w-full py-2 bg-white text-violet-800 font-bold rounded-lg transition-colors duration-200 hover:bg-gray-200"
              >
                Coming Soon!
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileDrawer;
