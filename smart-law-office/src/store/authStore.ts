"use client";
import { create } from "zustand";

// type
interface User {
  id: string;
  email: string;
  firmId?: string;
  role: string;
  firstName?: string;
  lastName?: string;
}

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;

  // user role
  role: "client" | "lawyer" | "";
  setRole: (role: "client" | "lawyer") => void;
  clearRole: () => void;
}
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
  role: "",
  setRole: (role) => set({ role }),
  clearRole: () => set({ role: "" })
}));
