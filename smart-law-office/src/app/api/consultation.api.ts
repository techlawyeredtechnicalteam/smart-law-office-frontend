import api from "./api";

export const ConsultService = {
  getConsultation: () => api.get("/consults"),
  createConsultation: (data: any) => api.post("/consults", data),
  getConsultationDetails: (consultCode: string) =>
    api.get(`/consults/${consultCode}`) // Fixed: was using template literal syntax incorrectly
};
