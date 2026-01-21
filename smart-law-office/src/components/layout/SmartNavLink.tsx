"use client";

import React from "react";
import { ALL_LINKS } from "../helper/navLinks";
import { ChevronDown, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";

const NavLinks = () => {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const role = user?.role || "";
  const [extendRoute, setExtendRoute] = React.useState<string[]>([]);

  const toggleExtendRoute = (route: string) => {
    setExtendRoute((prev) =>
      prev.includes(route)
        ? prev.filter((item) => item !== route)
        : [...prev, route]
    );
  };

  const visibleLinks = Object.values(ALL_LINKS).filter((link) =>
    link.roles.includes(role)
  );

  return (
    <nav className="flex-1 space-y-1">
      {visibleLinks.map((link) => {
        const isExtended = extendRoute.includes(link.route);
        const isActive =
          pathname === link.route ||
          link.subItems?.some((sub) => pathname === sub.route);

        return (
          <div key={link.route} className="relative group">
            <div className="flex items-center">
              <Link href={link.route} className="flex-1">
                <button
                  type="button"
                  className={`flex items-center w-full p-2.5 rounded-lg transition-all duration-200 text-left ${
                    isActive
                      ? "bg-white text-violet-600 font-semibold"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  <link.icon className="w-5 h-5 md:mr-3 shrink-0" />
                  <span className="hidden md:block text-sm">{link.name}</span>
                </button>
              </Link>

              {/* Chevron only visible on Desktop */}
              {link.subItems && link.subItems.length > 0 && (
                <button
                  type="button"
                  onClick={() => toggleExtendRoute(link.route)}
                  className="hidden md:block p-2.5 text-white"
                >
                  {isExtended ? (
                    <ChevronDown size={14} />
                  ) : (
                    <ChevronRight size={14} />
                  )}
                </button>
              )}
            </div>

            {/* Sub-items hidden on mobile/collapsed */}
            {link.subItems && isExtended && (
              <div className="hidden md:block ml-8 mt-1 space-y-1">
                {link.subItems
                  .filter((s) => s.roles.includes(role))
                  .map((subItem) => (
                    <Link key={subItem.route} href={subItem.route}>
                      <button
                        className={`flex items-center w-full p-2 pl-3 rounded-lg text-xs ${
                          pathname === subItem.route
                            ? "bg-white text-violet-600"
                            : "text-purple-100 hover:bg-white/10"
                        }`}
                      >
                        <subItem.icon className="w-4 h-4 mr-2" />
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
