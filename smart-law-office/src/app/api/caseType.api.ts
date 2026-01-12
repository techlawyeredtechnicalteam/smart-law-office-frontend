import api from "./api";

export const createCaseTypes = () => api.post("/case-types");
export const getAdminCaseTypes = () => api.get("/fee-schedules");
export const getAllCases = () => api.get("/all/cases");
export const getAdminCaseTypesById = (id: string) =>
  api.get(`/fee-schedules/${id}`);
export const deleteCaseTypes = () => api.delete("/case-types/{id}");
