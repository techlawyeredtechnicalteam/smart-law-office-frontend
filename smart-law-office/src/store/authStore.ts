"use client";
import { SignUpFormData } from "@/lib/FirmAuthSchema";
import { create, StateCreator } from "zustand";
import { persist } from "zustand/middleware";

const THIRTY_DAYS_IN_MS = 30 * 24 * 60 * 60 * 1000;

// type
export interface User {
  id: string;
  email: string;
  firmId?: string;
  role: "ADMIN" | "COUNSEL" | "CLIENT" | "";
  firstName?: string;
  lastName?: string;
  fullName: string;
  firmName?: string;
}

export type SignupFormTemp = {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  address?: string;
  consent: boolean;
  role: "ADMIN" | "COUNSEL" | "CLIENT" | "";
};

interface AuthState {
  // session
  token: string | null;
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

  // user role
  role: "CLIENT" | "COUNSEL" | "ADMIN" | "";
  setRole: (role: "CLIENT" | "COUNSEL" | "ADMIN" | "") => void;

  //navigation
  // currentPath: string;
  // setCurrentPath: (path: string) => void;

  // holding basic signupdetails
  signupFormTemp: SignupFormTemp | null;
  setSignupFormTemp: (data: Partial<SignupFormTemp> | null) => void;
}

const store: StateCreator<AuthState> = (set, get) => ({
  // session State
  token: null,
  lastActivity: null,
  isAuthenticated: false,

  // User State
  user: null,
  role: "",

  //App state
  isAuthReady: false,
  signupFormTemp: null,

  // Actions
  // Called on successful login
  loginSuccess: (token, userData) => {
    set({
      token,
      user: userData,
      lastActivity: Date.now(),
      isAuthenticated: true,
      isAuthReady: true,
      role: userData.role
    });
  },

  // Called on explicit user logout or session timeout
  logout: () => {
    // Clear all session-sensitive data
    set({
      token: null,
      user: null,
      lastActivity: null,
      isAuthenticated: false,
      isAuthReady: true,
      role: ""
    });
    console.log("User session invalidated/logged out.");
    // NOTE: You would typically redirect the user to the login page here
  },

  // Called on user interaction to reset the 30-day timer
  setLastActivity: () => {
    set({ lastActivity: Date.now() });
  },

  // Called on store hydration to enforce the 30-day inactivity rule
  checkSessionStatus: () => {
    const { token, lastActivity, logout, setLastActivity, isAuthenticated } =
      get();

    console.log("Checking session Status:", {
      hasToken: !!token,
      isAuthenticated,
      lastActivity
    });

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

  // clearUser: () =>
  //   set({
  //     user: null,
  //     token: null,
  //     isAuthenticated: false,
  //     lastActivity: null,
  //     role: ""
  //     // Keep isAuthReady true if it was already true, or set it if not
  //   }),

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
    // Only persist the token and the activity timestamp, user data, and role
    partialize: (state) => ({
      token: state.token,
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

// export const useAuthStore = create<AuthState>((set) => ({
//   user: null,
//   setUser: (user) => set({ user }),
//   clearUser: () => set({ user: null }),
//   role: "",
//   setRole: (role) => set({ role }),
//   isAuthReady: false,
//   setIsAuthReady: (ready) => set({ isAuthReady: ready }),

//   // temp new state
//   signupFormTemp: null,
//   setSignupFormTemp: (data) =>
//     set((state) => ({
//       signupFormTemp: data
//         ? ({ ...state.signupFormTemp, ...data } as SignupFormTemp)
//         : null
//     })),

//   // nav
//   currentPath: "/",
//   setCurrentPath: (path) => set({ currentPath: path })
// }));
