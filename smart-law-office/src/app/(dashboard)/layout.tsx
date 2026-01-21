"use client";

import {
  FileText,
  Shield,
  Settings,
  Bell,
  Search,
  Calendar,
  Clock,
  Loader2
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/authStore";
import { userName } from "@/components/dashboard/admin/Sidebar";
import NavLinks from "@/components/layout/SmartNavLink";
import { currentTime, currentDate } from "@/utils/time-date";
import Link from "next/link";
import React, { useEffect } from "react";
import { useCounselStore } from "@/store/manageCounsel";
import Image from "next/image";
import { getProfile } from "../api/profile.api";

export default function SmartLawOfficeDashboard({
  children
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuthStore();
  const { notifications } = useCounselStore();
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
              src="/logo.png" // Ensure this is your Legal Flow icon
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
          <div className="flex flex-col overflow-hidden hidden md:flex">
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
            <NavItem icon={<FileText size={20} />} label="Privacy Policy" />
            <NavItem icon={<Shield size={20} />} label="Terms and Conditions" />
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
        <header className="h-16 bg-white border-b flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="font-semibold text-gray-900 hidden sm:inline">
              Welcome, {profile?.firstName || user?.firstName}
            </span>
            <div className="hidden lg:flex items-center gap-2 border-l pl-4">
              <Calendar size={16} /> <span>{currentDate}</span>
              <Clock size={16} className="ml-2" /> <span>{currentTime}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <div className="relative hidden md:block w-48 lg:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search"
                className="pl-8 bg-gray-100 border-none h-9"
              />
            </div>
            <ButtonIcon
              icon={<Bell size={20} />}
              badgeCount={notifications.length}
            />
            <Link
              href="/settings/profile"
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <Settings size={20} className="text-gray-600" />
            </Link>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-6 bg-[#F3F4F6]">
          {children}
        </div>
      </main>
    </div>
  );
}

// Small Helper Components for Cleaner Code
function NavItem({
  icon,
  label,
  active = false
}: {
  icon: any;
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors ${
        active ? "bg-white/10" : "hover:bg-white/10 text-white/80"
      }`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

function ButtonIcon({ icon, badgeCount }: { icon: any; badgeCount: number }) {
  return (
    <button
      type="button"
      className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition cursor-pointer relative"
    >
      {icon}
      {badgeCount > 0 && (
        <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
          {badgeCount}
        </span>
      )}
    </button>
  );
}
