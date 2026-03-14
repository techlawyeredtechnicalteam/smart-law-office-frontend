import api from "./api";

export const editFirmProfile = (data: any) => api.patch("/firms", data);
export const deleteFirmProfile = () => api.patch("/profiles");
