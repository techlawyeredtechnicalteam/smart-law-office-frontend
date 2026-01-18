import api from "./api";

// export const caseDocument = (data: any) => api.post("/case-documents", data);
export const caseDocument = (payload: {
  caseId: string;
  document: string | File;
  name: string;
}) => api.post("/case-documents", payload);

export const getDocument = () => api.get("/api/v1/case-documents");

export const getDocumentById = () =>
  api.get("/api/v1/case-documents/{caseDocumentId}");

export const updateDocument = () =>
  api.patch("/api/v1/case-documents/{caseDocumentId}");

export const deleteDocuemntApi = (caseDocumentId: string) =>
  api.delete(`/api/v1/case-documents/${caseDocumentId}`);
