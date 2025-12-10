"use client";

import React from "react";
import { ALL_LINKS } from "../helper/navLinks";
// import { useAuthStore } from "@/store/authStore";
import { ChevronDown, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const NavLinks = () => {
  const pathname = usePathname();
  // const { currentPath, setCurrentPath, role } = useAuthStore();
  const [extendRoute, setExtendRoute] = React.useState<string[]>([]);

  // for sub items
  const toggleExtendRoute = (route: string) => {
    setExtendRoute((prev) =>
      prev.includes(route)
        ? prev.filter((item) => item !== route)
        : [...prev, route]
    );
  };

  // FIlters links based on the current user role
  const visibleLinks = Object.values(ALL_LINKS).filter((link) =>
    link.roles.includes("ADMIN")
  );

  return (
    <nav className="flex-1 space-y-1">
      {visibleLinks.map((link) => {
        const isExtended = extendRoute.includes(link.route);
        const isActive =
          pathname === link.route ||
          (link.subItems &&
            link.subItems.some((sub) => pathname === sub.route));

        return (
          <div key={link.route}>
            {/* Parent Link/Button */}
            {link.subItems ? (
              // If has sub-items, make it a button to toggle
              <button
                type="button"
                onClick={() => toggleExtendRoute(link.route)}
                className={`flex items-center justify-between w-full p-3 rounded-lg transition-all duration-200 text-left ${
                  isActive
                    ? "bg-purple-600/50 text-white font-semibold"
                    : "text-purple-200 hover:bg-purple-600/20 hover:text-white"
                }`}
              >
                <div className="flex items-center">
                  <link.icon className="w-5 h-5 mr-3 shrink-0" />
                  {link.name}
                </div>
                {isExtended ? (
                  <ChevronDown className="w-4 h-4 shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 shrink-0" />
                )}
              </button>
            ) : (
              // If no sub-items, make it a link
              <Link href={link.route}>
                <button
                  type="button"
                  className={`flex items-center justify-between w-full p-3 rounded-lg transition-all duration-200 text-left ${
                    isActive
                      ? "bg-purple-600/50 text-white font-semibold"
                      : "text-purple-200 hover:bg-purple-600/20 hover:text-white"
                  }`}
                >
                  <div className="flex items-center">
                    <link.icon className="w-5 h-5 mr-3 shrink-0" />
                    {link.name}
                  </div>
                </button>
              </Link>
            )}

            {/* Sub items */}
            {link.subItems && isExtended && (
              <div className="ml-8 mt-1 space-y-1">
                {link.subItems.map((subItem) => (
                  <Link key={subItem.route} href={subItem.route}>
                    <button
                      type="button"
                      className={`flex items-center w-full p-2 pl-3 rounded-lg transition-all duration-200 text-left text-sm ${
                        pathname === subItem.route
                          ? "bg-white text-[#7C5CFC] px-3 py-2 rounded-md text-sm font-medium shadow-sm cursor-pointer"
                          : "text-purple-200 hover:bg-purple-600/20 hover:text-white"
                      }`}
                    >
                      <subItem.icon className="w-4 h-4 mr-2 shrink-0" />
                      {subItem.name}
                    </button>
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default NavLinks;
