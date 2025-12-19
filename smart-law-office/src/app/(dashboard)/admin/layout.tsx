"use client";

import {
  FileText,
  Shield,
  Settings,
  Bell,
  Search,
  Calendar,
  Clock
} from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/shared/ui/avatar";
import { Input } from "@/components/shared/ui/input";
import { useAuthStore, User } from "@/store/authStore";
import { userName } from "@/components/dashboard/admin/Sidebar";
import NavLinks from "@/components/layout/SmartNavLink";
import { useSessionInitializer } from "@/hook/useSessionInitializer";
import SettingsDropdown from "@/components/settings/Settings";
import { currentTime, currentDate } from "@/utils/time-date";
import { UseCounselStore } from "@/store/manageCounsel";
import Link from "next/link";

export default function SmartLawOfficeDashboard({
  children
}: {
  children: React.ReactNode;
}) {
  const isReady = useSessionInitializer();
  const { user } = useAuthStore();
  const { isAddModalOpen, closeAddModal } = UseCounselStore();

  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-purple-600 font-semibold">Loading Session...</p>
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
            <span className="text-sm font-semibold">{user?.firstName} </span>
            <span className="text-xs opacity-70">{user?.role}</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <NavLinks />

        {/* Bottom Menu */}
        <div className="mt-auto space-y-1">
          <NavItem icon={<FileText size={20} />} label="Privacy Policy" />
          <NavItem icon={<Shield size={20} />} label="Terms and Conditions" />

          {/* Cynt.ai Card */}
          <div className="mt-4 bg-[#6B46C1] p-4 rounded-xl relative overflow-hidden">
            <div className="relative z-10 text-center">
              <p className="font-semibold mb-2">Cynt.ai</p>
              <button className="bg-white text-[#7C5CFC] text-xs font-bold py-1 px-4 rounded-full w-full">
                Coming soon
              </button>
            </div>
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
            <ButtonIcon icon={<Bell size={20} />} />
            <Link href="/admin/settings/$[tab]">
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

function ButtonIcon({ icon }: { icon: any }) {
  return (
    <button
      type="button"
      className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition cursor-pointer"
    >
      {icon}
    </button>
  );
}
