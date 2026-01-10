import type { FirmProfileData } from "@/store/firmProfileStore";
import type { SignupFormTemp } from "@/store/authStore";
import { toast } from "sonner";

// Utility functions for admin authentication and signup processes can be added here
/**@returns {string | null} */
export const validateFirmProfile = (
  firmProfileData: FirmProfileData,
  signupFormTemp: SignupFormTemp | null
): string | null => {
  if (!signupFormTemp) {
    return "Session expired. Please start over.";
  }
  if (!firmProfileData.firmName || !firmProfileData.firmType) {
    return "Please complete all firm profile steps";
  }
  if (!firmProfileData.logoFile) {
    return "Please upload a firm logo";
  }
  if (!firmProfileData.cacFile) {
    return "Please upload CAC certificate";
  }
  return null;
};

// handle firmProfile signup errors from custom fee
export const handleSignupError = (error: any, router: any) => {
  // Use a type-safe approach for status and message extraction if available
  const statusCode = error.response?.status;
  const errorMessage = error.response?.data?.message || error.message;

  if (statusCode === 409 || statusCode === 400) {
    const isConflict =
      typeof errorMessage === "string" &&
      (errorMessage.toLowerCase().includes("already") ||
        errorMessage.toLowerCase().includes("exists"));

    if (isConflict) {
      toast.error("This email is already registered. Please sign in instead.");
      router.push("/admin/login");
    } else {
      const displayMessage = Array.isArray(errorMessage)
        ? errorMessage.join(". ")
        : errorMessage;
      toast.error(displayMessage);
    }
  } else if (statusCode === 500) {
    toast.error("Server error. Please try again later.");
  } else {
    const displayMessage = Array.isArray(errorMessage)
      ? errorMessage.join(". ")
      : errorMessage || "Registration failed. Please try again.";
    toast.error(displayMessage);
  }
};
