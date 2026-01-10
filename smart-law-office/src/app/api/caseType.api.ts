import api from "./api";

export const createCaseTypes = () => api.post("/case-types");
export const getCaseTypes = () => api.get("/case-types");
export const getCaseTypesById = () => api.get("/case-types/{id}");
export const deleteCaseTypes = () => api.delete("/case-types/{id}");
