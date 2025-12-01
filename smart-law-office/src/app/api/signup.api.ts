import api from "./api";

export type SignupPayload = {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  address?: string;
  consent: boolean;
  role?: string;
  firmId: string;
};

export const signup = (payload: SignupPayload) =>
  api.post("/auths/signup", payload);

export const sendOtp = (payload: { email: string }) =>
  api.post("/auths/send-otp", payload);

export const verifyOtp = (payload: { email: string; otp: string }) =>
  api.post("/auths/verify-otp", payload);

export const finalizeSignup = (payload: { email: string }) =>
  api.post("/auths/signup-finalize", payload);

export const fetchUser = () => api.get("/auths/me");
