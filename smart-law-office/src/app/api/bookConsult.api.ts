import api from "./api";

export const bookConsultation = () => api.post("/consults/book");

export const getAllConsult = () => api.post("/all/consults");

export const getAllConsultCode = (consultCode: any) =>
  api.post(`/all/consults/${consultCode}`);

export const getConsults = () => api.get("/consults");

export const getConsultsCode = (consultCode: any) =>
  api.get(`/consults/${consultCode}`);

export const editConsult = (consultCode: any) =>
  api.patch(`/consults/${consultCode}`);

export const deleteConsults = (consultCode: any) =>
  api.delete(`/consults/${consultCode}`);
