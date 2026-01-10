import api from "./api";

export const getFeeSchedule = () => api.get("/fee-schedules");
