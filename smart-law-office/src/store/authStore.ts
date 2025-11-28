"use client";
import axios from "axios";
import React from "react";
import { set } from "zod";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// type
interface User {
  id: string;
  email: string;
  firmId?: string;
  role?: string;
  name?: string;
}

interface AuthState {
  //session state
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // signup flow state (temporary)
  step: number;
  userEmail: string;

  //actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  verifyCode: (email: string, code: string) => Promise<void>;
  // logout: () => void;

  // signup flow actions
  setStep: (newStep: number) => void;
  setUserEmail: (email: string) => void;
  resetSignupFlow: () => void;

  // session management
  checkAuth: () => Promise<void>;
  // refreshToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      //Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      step: 1,
      userEmail: "",

      //basic setters
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => set({ token }),

      // login mock api call
      login: async (email, password) => {
        set({ isLoading: true });
        try {
          // Mock API call
          // const response = await axios.post("/api/login", { email, password });
          // const { user, token } = response.data;

          // mock response
          await new Promise((resolve) => setTimeout(resolve, 1000)); // simulate network delay
          const mockUser: User = {
            id: "user_123",
            email: email,
            role: "lawyer",
            name: "John Doe"
          };
          const mockToken = "mock-jwt-token" + Date.now();

          set({
            user: mockUser,
            token: mockToken,
            isAuthenticated: true,
            isLoading: false
          });

          // store token in axios          
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      // sign up mock api call  simulation
      signup: async (email: string, password: string, firmId?: string) => {
        set({ isLoading: true });
        try {
          //replace with real api
          //const response = await axios.post("/api/signup", {email, password, firmId})

          // mock response
          await new Promise((resolve) => setTimeout(resolve, 1000));
          set({ isLoading: false, step: 2, userEmail: email });

          return Promise.resolve();
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      //verfiy code mock api call simulation
      verifyCode: async (email: string, code: string) => {
        set({ isLoading: true });
        try {
          // replace with real api
          // const response = await axios.post("/api/verify-code", { email, code });

          // mock response
          await new Promise((resolve) => setTimeout(resolve, 1000));

          const mockUser: User = {
            id: "user_123",
            email: get().userEmail,
            role: "lawyer"
          };
          const mockToken = "mock-jwt-token" + Date.now();

          set({
            user: mockUser,
            token: mockToken,
            isAuthenticated: true,
            isLoading: false,
            step: 3
          });

          return Promise.resolve();
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      // signup flow actions
      setStep: (newStep) => set({ step: newStep }),
      setUserEmail: (email) => set({ userEmail: email }),
      resetSignupFlow: () => set({ step: 1, userEmail: "" }),

      // session management
      checkAuth: async () => {
        set({ isLoading: true });
        try {
          // TODO: Replace with real API call to verify token validity
          // const response = await axios.get("/api/check-auth");
          // const { user, token } = response.data;
          // set({ user, token, isAuthenticated: true, isLoading: false });

          // For now, if there's a token in state, consider authenticated
          const state = get();
          if (state.token && state.user) {
            set({ isAuthenticated: true, isLoading: false });
          } else {
            set({ isAuthenticated: false, isLoading: false });
          }
        } catch (error) {
          set({ isAuthenticated: false, isLoading: false });
          throw error;
        }
      }
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      // only persist user and token
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
