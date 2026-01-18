import api from "./api";

export const editFirmProfile = (data: any) => api.patch("/profiles", data);
export const deleteFirmProfile = () => api.patch("/profiles");
