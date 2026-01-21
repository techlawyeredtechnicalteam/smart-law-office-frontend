import api from "./api";

export const saveConsultationFee = (data: {
  duration: number;
  fee: number;
  consultType: string;
}) => api.post("/firms/consultation-fees", data);

export const getConsultationFee = () => api.get("/firms/consultation-fees");

export const saveCaseRate = (data: { feeScheduleId: string; fee: number }) =>
  api.post("/case-types", data);

export const getFeeSchedule = () => api.get("/fee-schedules");

export const getCaseFormCaseTypes = () => api.get("/case-types");
