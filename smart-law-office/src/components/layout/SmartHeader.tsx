"use client";

import { getProfile } from "@/app/api/profile.api";
import { useAuthStore } from "@/store/authStore";
import { useCounselStore } from "@/store/manageCounsel";
import { currentDate } from "@/utils/time-date";
import { Bell, Calendar, Clock, Search, Settings } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import Link from "next/link";

export function SmartHeader() {
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

  const [time, setTime] = useState<string>("");

  useEffect(() => {
    // This only runs on the client, so the server never tries to guess the time
    const updateClock = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    };

    updateClock(); // Set initial time
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-4 text-sm text-gray-600">
        <span className="font-semibold text-gray-900 hidden sm:inline">
          Welcome, {profile?.firstName || user?.firstName}
        </span>
        <div className="hidden lg:flex items-center gap-2 border-l pl-4">
          <Calendar size={16} /> <span>{currentDate}</span>
          <Clock size={16} className="ml-2" /> <span>{time}</span>
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
