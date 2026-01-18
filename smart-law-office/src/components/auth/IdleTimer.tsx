"use client";

import React from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const THIRTY_MINUTES = 30 * 60 * 1000;

export function IdleTimer() {
  const { logout, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleLogout = () => {
    logout(); // call the deleteAuthCookies()
    router.push("/role");
    toast.info("Session expired due to inactivity. Please log in again");
  };

  const resetTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (isAuthenticated) {
      timeoutRef.current = setTimeout(handleLogout, THIRTY_MINUTES);
    }
  };

  React.useEffect(() => {
    // Events that count as "activity"
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart"
    ];

    if (isAuthenticated) {
      resetTimer();
      events.forEach((event) => window.addEventListener(event, resetTimer));
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [isAuthenticated]);

  return null; // This component doesn't render anything
}
