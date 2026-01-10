"use client";

import React from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter, usePathname } from "next/navigation";

export function useSessionInitializer() {
  const { setLastActivity, isAuthenticated, isAuthReady } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  // Continuous Activity Tracking (unchanged)
  React.useEffect(() => {
    if (!isAuthenticated) return;
    const updateActivity = () => setLastActivity();
    window.addEventListener("click", updateActivity);
    window.addEventListener("keydown", updateActivity);
    return () => {
      window.removeEventListener("click", updateActivity);
      window.removeEventListener("keydown", updateActivity);
    };
  }, [isAuthenticated, setLastActivity]);

  // Redirection Logic
  React.useEffect(() => {
    // Only redirect if:
    // 1. Auth check is finished (isAuthReady)
    // 2. User is NOT authenticated
    // 3. User is NOT already on the login/role page (avoids infinite loops)
    if (isAuthReady && !isAuthenticated && pathname !== "/role") {
      console.warn("User session invalid, moving to /role");
      router.replace("/role");
    }
  }, [isAuthReady, isAuthenticated, pathname, router]);

  return isAuthReady;
}
