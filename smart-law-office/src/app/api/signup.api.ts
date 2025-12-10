// import api, { FirmProfileAPI } from "./api";

// import { SignUpPayload } from "@/store/firmProfileStore";
import api, { CompleteSignupApi } from "./api";

// Complete form payload
// export type completeSignupPayload = FormData;

export const signup = (payload: any) => api.post("/auths/signup", payload);

export const sendOtp = (payload: { email: string }) =>
  api.post("/auths/send-otp", payload);

export const verifyOtp = (payload: { email: string; otp: string }) =>
  api.post("/auths/verify-otp", payload);

export const finalizeSignup = async (payload: { otp: string }) =>
  api.post("/auths/signup-finalize", payload);

export type loginPayload = {
  email: string;
  password: string;
};

export const login = (loginPayload: { email: string; password: string }) =>
  api.post("/auths/signin", loginPayload);
