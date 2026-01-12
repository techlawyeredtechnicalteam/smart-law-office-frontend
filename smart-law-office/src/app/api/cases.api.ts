import api from "./api";

export const createCase = (data: any) => api.post("/cases", data);

export const adminCreateCase = (data: any) =>
  api.post("/cases/admin-create", data);

export const getAllCases = () => api.get("/all/cases");
export const getCases = () => api.get("/cases");
export const getCaseById = (caseId: string) => api.get(`/cases/${caseId}`);
export const deleteCase = (caseId: string) => api.delete(`/cases/${caseId}`);
