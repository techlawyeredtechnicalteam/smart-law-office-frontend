"use client";

import React from "react";
import { ALL_LINKS } from "../helper/navLinks";
import { ChevronDown, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";

const NavLinks = () => {
  const pathname = usePathname();
  const { role } = useAuthStore();
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
    link.roles.includes(role)
  );

  //  Filter sub items too based on role
  const filteredLinksWithSubItems = visibleLinks.map((link) => {
    if (link.subItems) {
      return {
        ...link,
        subItems: link.subItems.filter((subItem) =>
          subItem.roles.includes(role)
        )
      };
    }
    return link;
  });

  return (
    <nav className="flex-1 space-y-1">
      {filteredLinksWithSubItems.map((link) => {
        const isExtended = extendRoute.includes(link.route);
        const isActive =
          pathname === link.route ||
          (link.subItems &&
            link.subItems.some((sub) => pathname === sub.route));

        return (
          <div key={link.route}>
            {/* Parent Link/Button */}
            {link.subItems && link.subItems.length > 0 ? (
              // If has sub-items, make it a link with a separate toggle button
              <div className="flex items-center">
                <Link href={link.route} className="flex-1">
                  <button
                    type="button"
                    className={`flex items-center w-full p-2.5 rounded-lg transition-all duration-200 text-left ${
                      isActive
                        ? "bg-white text-violet-600 font-semibold"
                        : "text-white hover:bg-white hover:text-violet-600"
                    }`}
                  >
                    <link.icon className="w-5 h-5 mr-3 shrink-0" />
                    {link.name}
                  </button>
                </Link>
                <button
                  type="button"
                  onClick={() => toggleExtendRoute(link.route)}
                  className={`p-2.5 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "text-violet-600"
                      : "text-white hover:text-violet-600"
                  }`}
                >
                  {isExtended ? (
                    <ChevronDown className="w-4 h-4 shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 shrink-0" />
                  )}
                </button>
              </div>
            ) : (
              // If no sub-items, make it a link
              <Link href={link.route}>
                <button
                  type="button"
                  className={`flex items-center justify-between w-full p-3 rounded-lg transition-all duration-200 text-left ${
                    isActive
                      ? "bg-white text-violet-600 font-semibold"
                      : "text-white hover:bg-white hover:text-violet-600"
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
            {link.subItems && link.subItems.length > 0 && isExtended && (
              <div className="ml-8 mt-1 space-y-1">
                {link.subItems.map((subItem) => (
                  <Link key={subItem.route} href={subItem.route}>
                    <button
                      type="button"
                      className={`flex items-center w-full p-2 pl-3 rounded-lg transition-all duration-200 text-left text-sm ${
                        pathname === subItem.route
                          ? "bg-white text-[#7C5CFC] px-3 py-2 rounded-md text-sm font-medium shadow-sm cursor-pointer"
                          : "text-purple-200 hover:bg-white hover:text-violet-600"
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
