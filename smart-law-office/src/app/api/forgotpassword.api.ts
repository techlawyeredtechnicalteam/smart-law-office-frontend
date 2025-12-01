import api from "./api";

export type sendPasswordPayload = {
  email: string;
};

export const sendPasswordResetOtp = (payload: sendPasswordPayload) =>
  api.post("/auths/send-otp", payload);

export type VerifyOtpPayload = {
  email: string;
  otp: string;
};

export const verifyPasswordResetOtp = (payload: VerifyOtpPayload) =>
  api.post("/auths/verify-otp", payload);

export type ResetPasswordPayload = {
  email: string;
  otp: string;
  password: string;
  confirmPassword: string;
};

export const resetPassword = (payload: ResetPasswordPayload) =>
  api.post("/auths/reset-password", payload);
