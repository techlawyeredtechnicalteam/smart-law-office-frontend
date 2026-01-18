import axios from "axios";
import { deleteAuthCookie, getAuthCookie } from "@/lib/cookies";

const baseURL =
  process.env.NEXT_PUBLIC_API_BASE ||
  "https://virtuallaw-backend-1.onrender.com/api/v1";

const AUTH_EXEMPT_ENDPOINTS = [
  "/auths/signin",
  "/auths/signup",
  "/auths/verify-otp",
  "/auths/finalize-signup"
];

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" }
});

//
api.interceptors.request.use(
  (config) => {
    // Optimization: Quick check for exempt endpoints
    const isAuthExempt = AUTH_EXEMPT_ENDPOINTS.some((endpoint) =>
      config.url?.includes(endpoint)
    );

    if (isAuthExempt) return config;

    // Get token from cookie (Ensure you're using 'auth-token' consistently)
    const token = getAuthCookie();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // In a production app, you might want to redirect to /login if no token
      // but only on protected routes
      console.warn("⚠️ Request made without token to:", config.url);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// --- RESPONSE INTERCEPTOR ---
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // 1. Handle Aborted Requests
    if (error.message === "CanceledError" || axios.isCancel(error)) {
      return Promise.reject(error);
    }

    // 2. Handle 401 Unauthorized (Token Expired or Invalid)
    if (error.response?.status === 401) {
      console.error("🚫 401 Unauthorized - Session Expired");

      // Clean up cookies
      deleteAuthCookie();

      // Prevent redirect loops: only redirect if not already on the login page
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/role")
      ) {
        // We use window.location for a hard refresh to clear all Zustand state
        window.location.href = "/role?error=session_expired";
      }
    }

    // 3. Handle 403 Forbidden (Role mismatch)
    if (error.response?.status === 403) {
      console.error("❌ 403 Forbidden - Insufficient Permissions");
    }

    return Promise.reject(error);
  }
);
export default api;
