import api from "./api";

export const staffCreateCase = (data: any) => api.post("/cases/staff", data);

export const adminCreateCase = (data: any) =>
  api.post("/cases/admin-create", data);

export const getAllCases = () => api.get("/all/cases");
export const getAllCasesDirect = () => api.get("/all/cases/direct");
export const getStaffCases = () => api.get("/cases/staff");
