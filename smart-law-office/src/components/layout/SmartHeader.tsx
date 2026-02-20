"use client";
import { getProfile } from "@/app/api/profile.api";
import { useAuthStore } from "@/store/authStore";
import { useNotificationStore } from "@/store/notificationStore"; // ✅
import { currentDate } from "@/utils/time-date";
import { Bell, Calendar, Clock, Search, Settings, X } from "lucide-react"; // ✅ X for delete
import React, { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import Link from "next/link";

const notificationDotStyles: Record<string, string> = {
  consultation: "bg-violet-500",
  success: "bg-green-500",
  info: "bg-blue-500",
  error: "bg-red-500"
};

export function SmartHeader() {
  const { user } = useAuthStore();
  const {
    notifications,
    unreadCount,
    markAllRead,
    deleteNotification,
    clearNotifications
  } = useNotificationStore();

  const [profile, setProfile] = React.useState<any>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  // Only admins see the bell notification panel
  const isAdmin =
    user?.role?.toUpperCase() === "ADMIN" ||
    user?.role?.toUpperCase() === "CLIENT";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        setProfile(response.data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };
    fetchProfile();
  }, []);

  const [time, setTime] = useState<string>("");
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-4 md:px-6 relative z-40">
      {/* Left */}
      <div className="flex items-center gap-4 text-sm text-gray-600">
        <span className="font-semibold text-gray-900 hidden sm:inline">
          Welcome, {profile?.firstName || user?.firstName}
        </span>
        <div className="hidden lg:flex items-center gap-2 border-l pl-4">
          <Calendar size={16} />
          <span>{currentDate}</span>
          <Clock size={16} className="ml-2" />
          <span>{time}</span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 md:gap-4">
        <div className="relative hidden md:block w-48 lg:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search"
            className="pl-8 bg-gray-100 border-none h-9"
          />
        </div>

        {/* Bell — only rendered for admins */}
        {isAdmin && (
          <div ref={bellRef} className="relative">
            <button
              type="button"
              onClick={() => {
                const next = !showNotifications;
                setShowNotifications(next);
                if (next) markAllRead();
              }}
              className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition cursor-pointer relative"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                {/* Header */}
                <div className="px-4 py-3 border-b flex items-center justify-between">
                  <span className="font-semibold text-sm text-gray-800">
                    Notifications
                  </span>
                  <span className="text-xs text-gray-400">
                    {notifications.length} total
                  </span>
                </div>

                {/* List */}
                <ul className="max-h-72 overflow-y-auto divide-y divide-gray-100">
                  {notifications.length === 0 ? (
                    <li className="px-4 py-8 text-center text-sm text-gray-400">
                      No notifications yet
                    </li>
                  ) : (
                    notifications.map((n) => {
                      const inner = (
                        <div className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition w-full text-left group">
                          <span
                            className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${
                              notificationDotStyles[n.type] ?? "bg-gray-400"
                            }`}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">
                              {n.message}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {n.details}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {new Date(n.createdAt).toLocaleString()}
                            </p>
                          </div>
                          {/*  Per-item delete — user triggered only */}
                          <button
                            aria-label="Delete notification"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              deleteNotification(n.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 transition p-1 hover:bg-red-50 rounded text-gray-400 hover:text-red-500 shrink-0"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      );

                      return (
                        <li key={n.id}>
                          {n.link ? (
                            <Link
                              href={n.link}
                              onClick={() => setShowNotifications(false)}
                              className="block"
                            >
                              {inner}
                            </Link>
                          ) : (
                            <div>{inner}</div>
                          )}
                        </li>
                      );
                    })
                  )}
                </ul>

                {/* Footer */}
                <div className="px-4 py-2.5 border-t bg-gray-50 flex justify-between items-center">
                  {/* <Link
                    href="/admin/billing"
                    onClick={() => setShowNotifications(false)}
                    className="text-xs font-medium text-violet-600 hover:underline"
                  >
                    Go to Billing →
                  </Link> */}
                  {/* Clear all — user triggered, shown only when there are notifications */}
                  {notifications.length > 0 && (
                    <button
                      type="button"
                      onClick={clearNotifications}
                      className="text-xs text-gray-400 hover:text-red-500 transition"
                    >
                      Clear all
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

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
