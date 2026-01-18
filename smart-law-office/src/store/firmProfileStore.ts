import { finalizeSignup, signup } from "@/app/api/signup.api";
import { create, StateCreator } from "zustand";
import { persist } from "zustand/middleware";
import { SignupFormTemp } from "./authStore";

export interface FirmProfileData {
  otp?: string;
  firmName: string;
  firmType: string;
  logoFile: string | null;
  logoFileName: string | null;
  brandColor: string;
  cacFile: string | null;
  cacFileName: string | null;
  fileData?: string | null;
  isCustomFeeEnabled: boolean;
  customFeeAmount: number | null;
}

interface FirmProfileState {
  step: number;
  formData: FirmProfileData;
  isSubmitting: boolean;

  // Actions
  nextStep: () => void;
  prevStep: () => void;
  updateFormData: (data: Partial<FirmProfileData>) => void;
  setFile: (
    field: "logoFile" | "cacFile",
    fileData: string | null,
    fileName: string | null
  ) => void;

  SubmitCompleteSignup: (adminData: any) => Promise<any>;
  resetProfile: () => void;
}

const initialFormData: FirmProfileData = {
  otp: "",
  firmName: "",
  firmType: "",
  logoFile: null,
  logoFileName: null,
  brandColor: "#7C3AED",
  cacFile: null,
  cacFileName: null,
  isCustomFeeEnabled: false,
  customFeeAmount: null
};

export const useFirmProfileStore = create<FirmProfileState>()(
  persist(
    (set, get) => ({
      step: 1,
      formData: initialFormData,
      isSubmitting: false,

      nextStep: () =>
        set((state) => {
          const currentStep = parseInt(state.step as any, 10) || 1;
          if (currentStep >= 3) return { step: 3 };
          return { step: currentStep + 1 };
        }),

      prevStep: () =>
        set((state) => {
          const currentStep = parseInt(state.step as any, 10) || 1;
          if (currentStep <= 1) return { step: 1 };
          return { step: currentStep - 1 };
        }),

      updateFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data }
        })),

      setFile: (field, fileData, fileName) => {
        set((state) => {
          const fileNameField =
            field === "logoFile" ? "logoFileName" : "cacFileName";
          return {
            formData: {
              ...state.formData,
              [field]: fileData,
              [fileNameField]: fileName
            }
          };
        });
      },

      SubmitCompleteSignup: async (adminData) => {
        set({ isSubmitting: true });

        const { formData } = get();

        try {
          // merge: this is the authStore and FIrmProfileStore
          const finalPayload = {
            ...adminData, // Email, Password, etc. AuthStore
            // ...formData // Firm details from this store

            // REMAPPING START
            name: formData.firmName,
            firmType: formData.firmType,
            colour: formData.brandColor,
            logo: formData.logoFile, // base64 string
            cac: formData.cacFile, // base64 string
            fee: formData.isCustomFeeEnabled
              ? Number(formData.customFeeAmount)
              : 0,
            role: "ADMIN",
            consent: true
          };

          const response = await signup(finalPayload);

          if (response.status === 200 || response.status === 201) {
            // get().resetProfile();

            return response.data;
          } else {
            throw new Error("Failed to create account");
          }
          // Don't reset yet! Wait for the verify page to succeed
        } catch (error) {
          console.error("Store Submission Error:", error);
          throw error;
        } finally {
          set({ isSubmitting: false });
        }
      },

      resetProfile: () => set({ step: 1, formData: initialFormData })
    }),

    {
      name: "firm-profile-storage",
      // we persist this so page refresh don't loose the logo/cac upload
      partialize: (state) => ({
        formData: state.formData,
        step: state.step
      })
    }
  )
);
