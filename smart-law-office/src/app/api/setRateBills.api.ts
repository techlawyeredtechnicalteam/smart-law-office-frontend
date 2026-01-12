import api from "./api";

export const saveConsultationFee = (data: { duration: number; fee: number }) =>
  api.post("/firms/consultation-fees", data);

export const saveCaseRate = (data: { feeScheduleId: string; fee: number }) =>
  api.post("/case-types", data);

export const getFeeSchedule = () => api.get("/fee-schedules");
