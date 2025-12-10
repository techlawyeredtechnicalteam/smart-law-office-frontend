import api from "./api";
// import type { caseItem } from "@/types/caseItem";

export const createCase = (data: any) => api.post("/cases", data);

export const getCases = () => api.get("/cases");

export const getCaseById = (caseId: string) => api.get(`/cases/${caseId}`);

export const deleteCase = (caseId: string) => api.delete(`/cases/${caseId}`);
