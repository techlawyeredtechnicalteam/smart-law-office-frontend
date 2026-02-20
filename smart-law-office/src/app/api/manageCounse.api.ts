import api from "./api";

// / ManageCounsel
// // Add Counsel Payload
export interface CounselPayload {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  consent: boolean;
  role: string;
  scn: string;
  barCertificate: string;
}

export const addCounsel = (payload: CounselPayload) =>
  api.post("/users", payload);

export const getCounsel = () => api.get("/users");

export const updateCounsel = (id: string) => api.patch(`/users/${id}`);

export const deleteCounsel = (id: string) => api.delete(`/users/${id}`);

export const fetchCounsel = () => api.get("/users");

// Bar Certificaye
export const uploadBarCertificate = async (
  base64: string,
  fileName: string
) => {
  const response = await api.post("/users/bar-certificate/upload", {
    barCertificate: base64,
    fileName: fileName
  });
  return response.data?.url || response.data?.data?.url;
};
