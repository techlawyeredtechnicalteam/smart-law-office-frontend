"use client";
import { setAuthCookie, deleteAuthCookie } from "@/lib/cookies";
import { SignUpFormData } from "@/types/FirmAuthSchema";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useBillingStore } from "./setRateBill";

export interface User {
  id: string;
  email: string;
  firmId?: string;
  role: "ADMIN" | "STAFF" | "CLIENT" | "";
  firstName: string;
  lastName: string;
  firm?: {
    name?: string;
    logo?: string;
  };
  firmName?: string;
  logo?: string;
  subscriptionStatus?: "ACTIVE" | "INACTIVE" | "EXPIRED";
  planType?: "BASIC" | "PRO";
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
  // user data
  user: User | null;
  signupFormTemp: any | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  // actions
  loginSuccess: (token: string, user: User) => Promise<void>;
  syncUser: (updatedUser: Partial<User>) => void;
  updateUserLogo: (newLogo: string) => void;
  logout: () => void;
  clearSignupTemp: () => void;
  setSignupFormTemp: (data: any) => void;
  setAuthLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null as User | null,
      isAuthenticated: false,
      signupFormTemp: null,
      isAuthLoading: false,

      setAuthLoading: (loading) => set({ isAuthLoading: loading }),
      setSignupFormTemp: (data) => set({ signupFormTemp: data }),
      clearSignupTemp: () => set({ signupFormTemp: null }),

      // Add a sync action
      syncUser: (updatedUser: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : null
        }));
      },
      updateUserLogo: (newLogo) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                firm: { ...state.user.firm, logo: newLogo },
                logo: newLogo
              }
            : null
        })),

      //
      loginSuccess: async (token, user) => {
        // Set cookie server-side FIRST, then update store
        await setAuthCookie(token, user.role);
        set({
          user,
          isAuthenticated: true,
          isAuthLoading: false
        });
      },

      logout: async () => {
        await deleteAuthCookie();
        useBillingStore.getState().resetFlow();
        set({ user: null, isAuthenticated: false, signupFormTemp: null });
      }
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        signupFormTemp: state.signupFormTemp
      })
    }
  )
);
