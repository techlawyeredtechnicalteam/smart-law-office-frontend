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
import { useSessionInitializer } from "@/hook/useSessionInitializer";
import { currentTime, currentDate } from "@/utils/time-date";
import Link from "next/link";
import { useFirmProfileStore } from "@/store/firmProfileStore";
import React from "react";
import api from "../api/api";
import { useCounselStore } from "@/store/manageCounsel";

export default function SmartLawOfficeDashboard({
  children
}: {
  children: React.ReactNode;
}) {
  const isReady = useSessionInitializer();
  const { user } = useAuthStore();
  const { notifications } = useCounselStore();

  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="text-purple-600 w-10 h-10 animate-spin" />
      </div>
    );
  }
  const userNameValue = userName(user);
  const userInitials = userNameValue
    ?.split(" ")
    .map((n: string) => n[0])
    .join("");

  return (
    <div className="flex h-screen bg-gray-50">
      {/* --- SIDEBAR (Purple) --- */}
      <aside className="w-64 bg-[#7C5CFC] text-white flex flex-col p-4">
        <div className="flex items-center gap-2 mb-8 px-2">
          <span className="font-bold text-lg">Smart Law Office</span>
        </div>

        {/* User Profile Card */}
        <div className="bg-[#6B46C1] rounded-xl p-3 mb-6 flex items-center gap-3">
          <Avatar>
            <AvatarImage src="/avatar-placeholder.png" />
            <AvatarFallback className="text-black">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">
              {user?.firstName} {user?.lastName}{" "}
            </span>
            <span className="text-xs opacity-70">{user?.role}</span>
          </div>
        </div>

        <div className="flex-1">
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
        <div className="mt-auto  bg-[#6B46C1] p-4 rounded-xl relative overflow-hidden">
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
        {/* Header */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-6 relative">
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <span className="font-semibold text-gray-900">
              Welcome back, {user?.firstName}
            </span>
            <div className="flex items-center gap-2">
              <Calendar size={16} /> <span>{currentDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} /> <span>{currentTime}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search"
                className="pl-8 bg-gray-100 border-none"
              />
            </div>
            <ButtonIcon
              icon={<Bell size={20} />}
              badgeCount={notifications.length}
            />
            <Link href="/settings/$[tab]">
              <Settings />
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6 bg-[#F3F4F6]">{children}</div>
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
