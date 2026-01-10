import axios from "axios";
import { getCookie } from "@/lib/cookies";

const baseURL =
  process.env.NEXT_PUBLIC_API_BASE || "http://16.171.115.243/api/v1";

const AUTH_EXEMPT_ENDPOINTS = ["/auths/signin", "/auths/signup"];

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" }
});

// Request Interceptor - Get token from cookie
api.interceptors.request.use(
  (config) => {
    const isAuthExempt = AUTH_EXEMPT_ENDPOINTS.some((endpoint) =>
      config.url?.includes(endpoint)
    );

    if (isAuthExempt) {
      console.log("📤 Request without auth (exempt endpoint):", {
        url: config.url
      });
      return config;
    }

    // Get token from cookie
    const token = getCookie("auth-token");

    // ADD THIS:
    console.log("🔍 Token Check:", {
      tokenExists: !!token,
      tokenLength: token?.length,
      url: config.url
    });

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("📤 Request with auth:", {
        method: config.method?.toUpperCase(),
        url: config.url,
        hasAuth: true
      });
    } else {
      console.warn("⚠️ NO TOKEN FOUND for:", config.url);
    }

    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // 1. If the request was aborted, DON'T log out.
    if (error.message === "Request aborted" || axios.isCancel(error)) {
      console.warn("📨 Request aborted mid-flight. Ignoring logout.");
      return Promise.reject(error);
    }

    // 2. Only log out if the server says 401 AND we have a role/token issue
    if (error.response?.status === 401) {
      console.error("🚫 Real 401 Unauthorized detected.");

      const { useAuthStore } = await import("@/store/authStore");
      // Only logout if we are not on a public page
      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/role"
      ) {
        useAuthStore.getState().logout();
        window.location.href = "/role";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
