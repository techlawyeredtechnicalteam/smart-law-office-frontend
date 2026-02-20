"use client";

import { FileText, Link, Shield } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/authStore";
import NavLinks from "@/components/layout/SmartNavLink";
import React, { useEffect } from "react";
import Image from "next/image";
import { getProfile } from "../api/profile.api";
import { SmartHeader } from "@/components/layout/SmartHeader";

function NavItem({
  icon,
  label,
  href,
  active = false
}: {
  icon: any;
  label: string;
  href?: string;
  active?: boolean;
}) {
  const className = `flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors ${
    active ? "bg-white/10" : "hover:bg-white/10 text-white/80"
  }`;

  const content = (
    <>
      <span className="shrink-0">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </>
  );

  if (href) {
    return (
      <a href={href} className={className}>
        {content}
      </a>
    );
  }

  return <div className={className}>{content}</div>;
}

export default function SmartLawOfficeDashboard({
  children
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuthStore();
  const [profile, setProfile] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  // Fetch Profile directly
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        setProfile(response.data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const displayLogo = profile?.firm?.logo || profile?.logo || user?.logo;
  const displayFirmName =
    profile?.firm?.name || profile?.firmName || "Legal Flow";

  const initials = profile
    ? `${profile.firstName?.[0] || ""}${profile.lastName?.[0] || ""}`.toUpperCase()
    : "??";

  return (
    <div className="flex h-screen bg-gray-50">
      {/* --- SIDEBAR (Purple) --- */}
      {/* Mobile: w-20 (icon only) | Desktop w-64 (full) */}
      <aside className="w-20 md:w-64 bg-[#7C5CFC] text-white flex flex-col p-4 shadow-xl z-20 transition-all duration-300">
        <div className="flex items-center gap-3 mb-8 px-2 py-2">
          <div className="relativemin-w-[40px] h-10 bg-white rounded-lg flex items-center justify-center overflow-hidden shadow-sm">
            <Image
              src="/logo.png" 
              alt="Legal Flow"
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
          <span className="font-bold text-xl tracking-tight hidden md:block">
            LegalFlow
          </span>
        </div>

        {/* User Profile Card */}
        <div className="bg-[#6B46C1] rounded-xl p-3 mb-6 flex items-center gap-3">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarImage src={displayLogo} className="object-cover bg-white" />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-col overflow-hidden hidden md:flex">
            <span className="text-sm font-semibold truncate">
              {profile?.firstName || user?.firstName}{" "}
              {profile?.lastName || user?.lastName}
            </span>
            {/* <span className="text-xs opacity-70">{user?.role}</span> */}
            <span className="text-xs opacity-70 truncate">
              {displayFirmName}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          {/* Navigation Menu */}
          <NavLinks />

          <hr className="my-4 border-purple-400/30" />

          {/* Bottom Menu */}
          <div className="space-y-1">
            <NavItem
              icon={<FileText size={20} />}
              label="Privacy Policy"
              href="/legal/privacy-policy-for-legalflow-by-cyntonisca"
            />
            <NavItem
              icon={<Shield size={20} />}
              label="Terms and Conditions"
              href="/legal/terms-of-service-for-legalflow"
            />
          </div>
        </div>

        {/* Cynt.ai Card */}
        <div className="mt-auto  bg-[#6B46C1] p-4 rounded-xl hidden md:block">
          <div className="relative z-10 text-center">
            <p className="font-semibold mb-2">Cynt.ai</p>
            <button className="bg-white text-[#7C5CFC] text-xs font-bold py-1 px-4 rounded-full w-full">
              Coming soon
            </button>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <SmartHeader />

        <div className="flex-1 overflow-auto p-4 md:p-6 bg-[#F3F4F6]">
          {children}
        </div>
      </main>
    </div>
  );
}
