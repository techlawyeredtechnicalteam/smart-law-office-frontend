import api from "./api";

// Admin Sign up
export const signup = (payload: any) => api.post("/auths/signup", payload);

export const sendOtp = (payload: { email: string }) =>
  api.post("/auths/send-otp", payload);

export const verifyOtp = (payload: { email: string; otp: string }) =>
  api.post("/auths/verify-otp", payload);

export const finalizeSignup = async (payload: { otp: string }) =>
  api.post("/auths/signup-finalize", payload);

// Login for both admin, client, staff
export type loginPayload = {
  email: string;
  password: string;
};

export const login = (loginPayload: { email: string; password: string }) =>
  api.post("/auths/signin", loginPayload);

// Client Sign up
export interface signupClientPayload {
  email: string;
  firstName: string;
  lastName: string;
  consent: boolean;
  role: string;
}
export const signupClient = (payload: signupClientPayload) =>
  api.post("/auths/signup", payload);
