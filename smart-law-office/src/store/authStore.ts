"use client";
import { deleteCooke, getCookie, setCookie } from "@/lib/cookies";
import { SignUpFormData } from "@/types/FirmAuthSchema";
import { create, StateCreator } from "zustand";
import { persist } from "zustand/middleware";

const THIRTY_DAYS_IN_MS = 30 * 24 * 60 * 60 * 1000;

// User data structure
export interface User {
  id: string;
  email: string;
  firmId?: string;
  role: "ADMIN" | "STAFF" | "CLIENT" | "";
  firstName: string;
  lastName: string;
  firmName?: string;
}

// stores the admin data temporary until on final signup
export type SignupFormTemp = {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  address?: string;
  consent: boolean;
  role: "ADMIN" | "STAFF" | "CLIENT" | "";
};

// Auth Store State and Actions
interface AuthState {
  lastActivity: number | null;
  isAuthenticated: boolean;

  // user data
  user: User | null;
  setUser: (user: User | null) => void;

  // Apps states not persisited
  isAuthReady: boolean;
  setIsAuthReady: (ready: boolean) => void;

  // actions
  loginSuccess: (token: string, userData: User) => void;
  logout: () => void;
  setLastActivity: () => void;
  checkSessionStatus: () => void;
  getToken: () => string | null;

  // user role
  role: "CLIENT" | "STAFF" | "ADMIN" | "";
  setRole: (role: "CLIENT" | "STAFF" | "ADMIN" | "") => void;

  // holding basic signupdetails
  signupFormTemp: SignupFormTemp | null;
  setSignupFormTemp: (data: Partial<SignupFormTemp> | null) => void;

  updateUserRole: (newRole: "CLIENT" | "STAFF" | "ADMIN") => void;
}

const store: StateCreator<AuthState> = (set, get) => ({
  // session State
  lastActivity: null,
  isAuthenticated: false,

  // User State
  user: null,
  role: "",

  //App state
  isAuthReady: false,
  signupFormTemp: null,

  updateUserRole: (newRole) => {
    set((state) => ({
      role: newRole,
      user: state.user ? { ...state.user, role: newRole } : null
    }));
  },

  // Get toekn from cookie
  getToken: () => getCookie("auth-token"),
  // Called on successful login
  loginSuccess: (token, userData) => {
    // Store token in both localStorage (via Zustand) and cookies (for middleware)
    setCookie("auth-token", token, 30); //30 days

    set({
      user: userData,
      lastActivity: Date.now(),
      isAuthenticated: true,
      isAuthReady: true,
      role: userData.role
    });
  },

  // Called on explicit user logout or session timeout
  logout: () => {
    // Clear token from cookies
    deleteCooke("auth-token");
    // Clear all session-sensitive data
    set({
      user: null,
      lastActivity: null,
      isAuthenticated: false,
      isAuthReady: true,
      role: ""
    });
    console.log("User session invalidated/logged out.");
  },

  // Called on user interaction to reset the 30-day timer
  setLastActivity: () => {
    set({ lastActivity: Date.now() });
  },

  // Called on store hydration to enforce the 30-day inactivity rule
  checkSessionStatus: () => {
    const { getToken, lastActivity, logout, setLastActivity, isAuthenticated } =
      get();

    const token = getToken();

    if (isAuthenticated && token) {
      console.log("Already authenticated, skipping check");
      set({ isAuthReady: true });
      return;
    }

    // 1. If no token, or the token is present but the user data failed to load, we are out.
    if (!token) {
      console.log("No token found - user not authenticated");
      set({ isAuthenticated: false, isAuthReady: true });
      return;
    }

    const now = Date.now();

    // 2. Check for 30-day inactivity timeout
    if (lastActivity && now - lastActivity > THIRTY_DAYS_IN_MS) {
      console.warn(
        "Session expired due to 30 days of inactivity. Auto-logging out."
      );
      logout(); // Auto-logout if inactive for too long
      // set({ isAuthReady: true });
      return;
    }

    // 3. Session is valid. Update activity and set isAuthenticated/isAuthReady
    console.log("Valid session found - authenticating user");
    setLastActivity();
    set({ isAuthenticated: true, isAuthReady: true });
  },

  // Existing Actions Cleaned Up
  setUser: (user) => set({ user }),

  setIsAuthReady: (ready) => set({ isAuthReady: ready }),

  setRole: (role) => set({ role }),

  setSignupFormTemp: (data) =>
    set((state) => ({
      signupFormTemp: data
        ? ({ ...state.signupFormTemp, ...data } as SignupFormTemp)
        : null
    }))
});

export const useAuthStore = create<AuthState>()(
  persist(store, {
    name: "auth-session-storage", // Key used in localStorage
    // Only persist the activity timestamp, user data, and role
    partialize: (state) => ({
      lastActivity: state.lastActivity,
      user: state.user,
      role: state.role,
      isAuthenticated: state.isAuthenticated
    }),
    // Crucial step: run the check after data is loaded
    onRehydrateStorage: () => (state) => {
      if (state) {
        // 1. Check validity (session check also handles setting isAuthReady=true)
        state.checkSessionStatus();
      }
    }
  })
);
