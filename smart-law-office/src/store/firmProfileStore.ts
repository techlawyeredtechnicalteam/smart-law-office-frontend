import { finalizeSignup, signup } from "@/app/api/signup.api";
import { create, StateCreator } from "zustand";
import { persist } from "zustand/middleware";
import { SignupFormTemp } from "./authStore";
import { getProfile } from "@/app/api/profile.api";

export interface FirmProfileData {
  otp?: string;
  email: string;
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
  bankName: string;
  bankAccountNumber: string;
  bankAccountName: string;
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

  fetchProfile: () => Promise<void>;
  SubmitCompleteSignup: (adminData: any) => Promise<any>;
  resetProfile: () => void;
}

const initialFormData: FirmProfileData = {
  otp: "",
  firmName: "",
  firmType: "",
  email: "",
  logoFile: null,
  logoFileName: null,
  brandColor: "#7C3AED",
  cacFile: null,
  cacFileName: null,
  isCustomFeeEnabled: false,
  customFeeAmount: null,
  bankName: "",
  bankAccountName: "",
  bankAccountNumber: ""
};

export const useFirmProfileStore = create<FirmProfileState>()(
  persist(
    (set, get) => ({
      step: 1,
      formData: initialFormData,
      isSubmitting: false,

      fetchProfile: async () => {
        set({ isSubmitting: true });
        try {
          const response = await getProfile();          
          const data = response.data;

          const firmData = data.firm;

          if (firmData) {
            set({
              formData: {
                ...get().formData,
                firmName: firmData.name || "",
                firmType: firmData.firmType || "",
                brandColor: firmData.colour || "#7C3AED",
                bankName: firmData.bankName || "",
                bankAccountName: firmData.bankAccountName || "",
                bankAccountNumber: firmData.bankAccountNumber || "",
                isCustomFeeEnabled: !!firmData.fee,
                customFeeAmount: firmData.fee || 0
              }
            });
          }
        } catch (error) {
          console.error("Failed to fetch profile:", error);
        } finally {
          set({ isSubmitting: false });
        }
      },

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
          const finalPayload = {
            ...adminData,          
            name: formData.firmName,
            email: adminData.email || formData.email,
            firmType: formData.firmType,
            colour: formData.brandColor,
            logo: formData.logoFile, // base64 string
            cac: formData.cacFile, // base64 string
            fee: formData.isCustomFeeEnabled
              ? Number(formData.customFeeAmount)
              : 0,
            bankName: formData.bankName,
            bankAccountNumber: formData.bankAccountNumber,
            bankAccountName: formData.bankAccountName,
            role: "ADMIN",
            consent: true
          };

          const response = await signup(finalPayload);

          if (response.status === 200 || response.status === 201) {           

            return response.data;
          } else {
            throw new Error("Failed to create account");
          }          
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
      partialize: (state) => ({
        formData: state.formData,
        step: state.step
      })
    }
  )
);
