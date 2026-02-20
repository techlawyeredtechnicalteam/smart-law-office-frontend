import api from "./api";

export const invoiceConsultation = (payload: {
  consultationFeeId: string;
  clientEmail: string;
  consultType: string;
  consultAt: string;
  note: string;
  amount: number;
}) => api.post("/invoices/consults", payload);

export const invoiceCase = (payload: {
  caseTypeId: string;
  staffEmail: string;
  userEmail: string;
  caseAt: string;
  note: string;
  amount: number;
}) => api.post("/invoices/case", payload);

export const getInvoices = () => api.get("/invoices");
