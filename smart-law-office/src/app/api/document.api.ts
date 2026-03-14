import api from "./api";

// export const caseDocument = (payload: {
//   caseId: string;
//   document: string | File;
//   name: string;
// }) => api.post("/case-documents/direct", payload);

export const caseDocument = (payload: {
  caseId: string;
  document: string | File;
}) => api.post("/case-documents/direct", payload);

export const getDocument = () => api.get("/api/v1/case-documents");

export const getDocumentById = () =>
  api.get("/api/v1/case-documents/{caseDocumentId}");

export const updateDocument = () =>
  api.patch("/api/v1/case-documents/{caseDocumentId}");

export const deleteDocuemntApi = (caseDocumentId: string) =>
  api.delete(`/api/v1/case-documents/${caseDocumentId}`);
