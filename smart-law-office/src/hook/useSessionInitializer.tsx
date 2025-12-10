"use client";

import React from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

export function useSessionInitializer() {
  const { setLastActivity, isAuthenticated, isAuthReady } = useAuthStore();
  const router = useRouter();
  const [hasCheckedSession, setHasCheckedSession] = React.useState(false);

  React.useEffect(() => {
    if (!hasCheckedSession) {
      console.log("Initial session check on mount");
      setHasCheckedSession(true);
    }
  }, [hasCheckedSession]);

  // Continous Activity Tracking
  React.useEffect(() => {
    if (!isAuthenticated) return;

    const updateActivity = () => setLastActivity();

    // listen for common user interaction event to rset the 30 days inactivity
    window.addEventListener("mousemove", updateActivity);
    window.addEventListener("keydown", updateActivity);
    window.addEventListener("click", updateActivity);

    return () => {
      window.removeEventListener("mousemove", updateActivity);
      window.removeEventListener("keydown", updateActivity);
      window.removeEventListener("click", updateActivity);
    };
  }, [isAuthenticated, setLastActivity]);

  // Redirection Logic
  React.useEffect(() => {
    console.log("Auth status:", { isAuthReady, isAuthenticated });

    if (isAuthReady && !isAuthenticated) {
      const currentPath = window.location.pathname;
      if (currentPath !== "/login") {
        router.push("/login");
      }
    }
  }, [isAuthReady, isAuthenticated, router]);

  return isAuthReady;
}
