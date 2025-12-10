import { signup } from "@/app/api/signup.api";
import { create, StateCreator } from "zustand";
import { persist } from "zustand/middleware";
import { SignupFormTemp } from "./authStore";

export interface FirmProfileData {
  // Step 1: Firm Type
  firmName: string;
  firmType: string;

  // Step 2: Branding and CAC
  logoFile: string | null;
  logoFileName: string | null;
  brandColor: string;
  cacFile: string | null;
  cacFileName: string | null;
  fileData?: string | null;

  // Step 3: Custom Fee
  isCustomFeeEnabled: boolean;
  customFeeAmount: number | null;
}

interface FirmProfileStore {
  currentStep: number;
  formData: FirmProfileData;
  isSubmitting: boolean;

  // Actions
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateFormData: (data: Partial<FirmProfileData>) => void;
  setFile: (
    field: "logoFile" | "cacFile",
    fileData: string | null,
    fileName: string | null
  ) => void;

  SubmitCompleteSignup: (signupData: any) => Promise<any>;
  resetProfile: () => void;
}

const PRIMARY_COLOR = "#7C3AED";

const initialFormData: FirmProfileData = {
  firmName: "",
  firmType: "",
  logoFile: null,
  logoFileName: null,
  brandColor: PRIMARY_COLOR,
  cacFile: null,
  cacFileName: null,
  isCustomFeeEnabled: false,
  customFeeAmount: null
};

const store: StateCreator<FirmProfileStore> = (set, get) => ({
  currentStep: 1,
  formData: initialFormData,
  isSubmitting: false,

  // Navigates to a specific step
  setCurrentStep: (step) => {
    set({ currentStep: step });
  },

  // increment step
  nextStep: () => {
    set((state) => ({
      currentStep:
        state.currentStep < 3 ? state.currentStep + 1 : state.currentStep
    }));
  },

  prevStep: () => {
    set((state) => ({
      currentStep:
        state.currentStep > 1 ? state.currentStep - 1 : state.currentStep
    }));
  },

  updateFormData: (data) => {
    set((state) => ({
      formData: { ...state.formData, ...data }
    }));
  },

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

  // Action that handle the entire sign-up API response
  SubmitCompleteSignup: async (signupData: SignupFormTemp) => {
    set({ isSubmitting: true });
    try {
      const { formData } = get();

      if (!signupData) {
        throw new Error("Signup data not found. Please start over.");
      }

      const fullName = signupData.fullName.trim();
      const nameParts = fullName.split(/\s+/).filter((part) => part.length > 0);
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || firstName; // Fallback to firstName if only one word

      const feeValue = formData.isCustomFeeEnabled
        ? typeof formData.customFeeAmount === "string"
          ? parseFloat(formData.customFeeAmount) || 0
          : formData.customFeeAmount || 0
        : 0;

      // PI Payload
      const payload = {
        // Signup fields
        email: signupData.email,
        password: signupData.password,
        confirmPassword: signupData.confirmPassword,
        firstName: firstName,
        lastName: lastName,
        address: signupData.address || "N/A",
        consent: true,
        role: "ADMIN",

        // Firm Profile Fields
        name: formData.firmName,
        firmType: formData.firmType,
        colour: formData.brandColor,
        // officeLink: formData.officeLink,
        isCustomFeeEnabled: formData.isCustomFeeEnabled,
        fee: Number(feeValue),

        // Files as base64
        logo: formData.logoFile,
        cac: formData.cacFile
      };

      // Call the signup api with complete data
      const response = await signup(payload);

      // on sucess, reset profile
      get().resetProfile();

      // return response
      return response;
    } catch (error) {
      console.error("Error submitting profile:", error);
      throw error;
    } finally {
      set({ isSubmitting: false });
    }
  },

  resetProfile: () =>
    set({
      currentStep: 1,
      formData: initialFormData,
      isSubmitting: false
    })
});

// / --- EXPORT PERSISTED STORE ---

export const useFirmProfileStore = create<FirmProfileStore>()(
  persist(store, {
    name: "firm-profile-storage",
    // Only persist data relevant to form progress
    partialize: (state) => ({
      currentStep: state.currentStep,
      formData: state.formData
    })
    // Using a custom storage might be needed if you serialize/deserialize complex types,
    // but standard localStorage is fine for this structure.
  })
);

// Helper function to convert base64 to file
// const base64ToFile = (
//   base64String: string,
//   fileName: string
// ): File => {
//   const arr = base64String.split(",");
//   const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
//   const bstr = atob(arr[1]);
//   let n = bstr.length;
//   const u8arr = new Uint8Array(n);
//   while (n--) {
//     u8arr[n] = bstr.charCodeAt(n);
//   }
//   return new File([u8arr], fileName, { type: mime });
// };
