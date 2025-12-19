import { AddCounselFormType } from "@/lib/counselSchema";
import api from "./api";
import { Counsel } from "@/store/manageCounsel";

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

// ManageCounsel
// // Add Counsel Payload
export interface CounselPayload {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  consent: boolean;
  role: string;
  scn: string;
  barCertificate: string;
}

export const addCounsel = (payload: CounselPayload) =>
  api.post("/users", payload);

export const updateCounsel = (id: string, payload: Partial<CounselPayload>) =>
  api.patch(`/users/${id}`, payload);

export const deleteCounsel = (id: string) => api.delete(`/users/${id}`);

export const fetchCounsel = () => api.get("/users?role=STAFF");

// Communications API
export const messagesApi = {
  // fetch all message threads
  getThreads: async () => api.get("/messages/threads"),

  // send a private message
  sendPrivateMessage: (data: { recipientId: string; content: string }) =>
    api.post("/messages/private", data),

  // post: send a message to a room or case
  sendRoomMessge: (data: { roomId: string; content: string }) =>
    api.post("/messages/room", data),

  // put: update
  updateMessage: (id: string, data: { content: string }) =>
    api.put(`/messages/${id}`, data),

  // delete
  deleteMessage: (id: string) => api.delete(`/messages/${id}`)
};
