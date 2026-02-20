import axios from "axios";
import { deleteAuthCookie, getAuthCookie } from "@/lib/cookies";
import { toast } from "sonner";

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
      // redirect to /login if no token
      // but only on protected routes
      const isProtectedRoute = !AUTH_EXEMPT_ENDPOINTS.some((endpoint) =>
        config.url?.includes(endpoint)
      );
      if (isProtectedRoute) {
        console.warn(
          "⚠️ No auth token found for protected API call:",
          config.url
        );
      }
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
      deleteAuthCookie();

      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/role")
      ) {
        window.location.href = "/role?error=session_expired";
      }
    }

    // 3. Handle 403 Forbidden (Role mismatch)
    if (error.response?.status === 403) {
      console.error("❌ 403 Forbidden - Insufficient Permissions");
      toast.error("You do not have permission to perform this action.");
    }

    return Promise.reject(error);
  }
);
export default api;
