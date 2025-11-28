"use client";
import React from "react";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponseType";
import type { SignUpFormData } from "@/types/zodSchemaTypes";
// import {useAuthStore} from '@/store/auth'

//1.API setup
const API_BASE_URL = "https://api.yourdomain.com/v1"; // Replace with API

// Production API Setup (Simulating Axios and Base URL)
export const api = {
  // Mock implementation matching the desired API signature
  post: async (endpoint: string, data: any): Promise<ApiResponse> => {
    // --- MOCK API REMAINS FOR DEMO (To keep the component runnable) ---
    const mockUser = { verificationCode: "123456" };
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (endpoint === "signup") {
      console.log("API: Registering user...");
      return { success: true, userEmail: (data as SignUpFormData).email };
    }
    if (endpoint === "verify") {
      console.log(`API: Verifying code '${data.code}'...`);
      if (data.code === mockUser.verificationCode) {
        return { success: true };
      }
      throw new Error('Invalid verification code. Try "123456".');
    }
    if (endpoint === "create-account") {
      console.log("API: Finalizing account creation...");
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return { success: true };
    }

    throw new Error("Unknown API endpoint");
  }
};
