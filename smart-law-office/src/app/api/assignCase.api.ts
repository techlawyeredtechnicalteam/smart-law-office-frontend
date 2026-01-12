import api from "./api";

export interface AssignCasePayload {
  consultCode: string;
  staffEmail: string;
  caseTypeId: string;
}

export const assignCase = (payload: AssignCasePayload) =>
  api.post("/cases/assign-case", payload);

export const getStaff = () => api.get("/users?role=STAFF");
