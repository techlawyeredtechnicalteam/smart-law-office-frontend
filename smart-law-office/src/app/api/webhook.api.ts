import api from "./api";

export const webHookPayStack = (data: { reference: string }) =>
  api.post("/webhooks/paystack", data);
