import { email } from "zod";
import { create } from "zustand";

interface ForgotPasswordState {
  email: string;
  setEmail: (email: string) => void;
}

export const useForgotPasswordStore = create<ForgotPasswordState>((set) => ({
  email: "",
  setEmail: (email) => set({ email })
}));
