import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE || "https://16.171.115.243/api/v1",
  withCredentials: true, // allow cookies from BE
  headers: { "Content-Type": "application/json" }
});

// Request Interceptor
api.interceptors.request.use((config) => {
  // log what's sent
  console.log("Request", {
    method: config.method?.toUpperCase(),
    url: `${config.baseURL}${config.url}`,
    data: config.data
  });
  return config;
});

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    // runs for successful response
    console.log("Response:", response.status, response.data);

    return response;
  },
  (error) => {
    // Runs fr failed response
    console.error("Response Error:", {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status
    });
  }
);

export default api;
