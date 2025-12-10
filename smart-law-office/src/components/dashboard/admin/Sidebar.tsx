"use client";

import React from "react";
import { useAuthStore } from "../../../store/authStore";
import { Monitor } from "lucide-react";
import NavLinks from "../../layout/SmartNavLink";

export const userName = (user: any) =>
  user
    ? `${user.fullName || ""} ${user.lastName || ""}`.trim() || user.email
    : "Loading...";

const Sidebar = () => {
  const { user } = useAuthStore();
  const userNameValue = userName(user);
  const userInitials =
    userNameValue
      ?.split(" ")
      .map((n: string) => n[0])
      .join("") || "U";

  return (
    <div className="flex flex-col w-64 bg-violet-600 text-white min-h-screen p-4 shadow-2xl">
      <div className="py-4 mb-4">
        <h1 className="text-base tracking-wider text-white flex items-center">
          Smart Law Office
        </h1>
      </div>

      {/* User Profile Section */}
      <div className="bg-violet-600 p-4 rounded-xl shadow-md mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate">{userNameValue}</p>
            <p className="text-[8px] text-violet-200 break-all pt-1">
              {userInitials}
            </p>
          </div>
          {/* <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate">{userNameValue}</p>
            <p className="text-[8px] text-violet-200 break-all pt-1">
              ID: {user?.id || "N/A"}
            </p>
          </div> */}
        </div>
      </div>

      {/* Nav Links */}
      <div className="grow overflow-y-auto pr-1">{<NavLinks />}</div>

      {/* ChatBox Engine */}
      <div className="mt-8 pt-4">
        <div className="p-4 bg-violet-800 rounded-xl text-center shadow-inner">
          <p className="text-xs font-semibold text-violet-200 mb-2">Cynt.ai</p>
          <button className="w-full text-xs py-2 bg-white text-violet-800 rounded-lg transition-colors duration-200 hover:bg-gray-200">
            Coming Soon!
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
