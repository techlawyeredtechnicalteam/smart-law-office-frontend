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

let isLoggingOut = false;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // 1. Handle Aborted Requests
    if (error.message === "CanceledError" || axios.isCancel(error)) {
      return Promise.reject(error);
    }

    const status = error.response?.status;

    // 2. Handle 401 Unauthorized (Token Expired or Invalid)
    if (status === 401 && !isLoggingOut) {
      isLoggingOut = true;

      toast.warning("Your session has expired. Logging you out...", {
        duration: 2000
      });

      // Wait for the toast to be visible before redirecting
      setTimeout(async () => {
        try {
          await deleteAuthCookie();
        } catch (e) {
          console.warn("Failed to clear auth cookie:", e);
        }

        if (
          typeof window !== "undefined" &&
          !window.location.pathname.includes("/role")
        ) {
          window.location.href = "/role?error=session_expired";
        }

        // Reset flag after redirect (in case redirect fails somehow)
        isLoggingOut = false;
      }, 2000);
    }

    // 3. Handle 403 Forbidden (Role mismatch)
    if (status === 403) {
      console.error(
        "❌ 403 Forbidden - Insufficient Permissions:",
        error.config?.url
      );
      toast.error(
        "You don't have the authority to perform this action. Please contact your admin."
      );
    }

    return Promise.reject(error);
  }
);
export default api;
