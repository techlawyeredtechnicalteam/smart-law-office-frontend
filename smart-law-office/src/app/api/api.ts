import axios from "axios";

const baseURL =
  process.env.NEXT_PUBLIC_API_BASE || "http://16.171.115.243/api/v1";

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: { "Content-Type": "application/json"}
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    // Get auth token from localStorage
    const authState = localStorage.getItem('auth-session-storage');
    if (authState) {
      try {
        const parsedAuth = JSON.parse(authState);
        if (parsedAuth.state?.token) {
          config.headers.Authorization = `Bearer ${parsedAuth.state.token}`;
        }
      } catch (error) {
        console.error("Error parsing auth state:", error);
      }
    }

    // log what's sent
    console.log("Request", {
      method: config.method?.toUpperCase(),
      url: `${config.baseURL}${config.url}`,
      data: config.data,
      hasAuth: !!config.headers.Authorization
    });
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

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
      status: error.response?.status,
      url: error.config?.url
    });
    return Promise.reject(error);
  }
);
// Upload API FOr FIle upload and Firm
// seperate instance for FirmProfile Store
// export const CompleteSignupApi = axios.create({
//   baseURL,
//   headers: {
//     "Content-Type": "multipart/form-data",
//     Accept: "*/*"
//   },
//   withCredentials: false
// });

// Request Interceptor for upload API
// CompleteSignupApi.interceptors.request.use(
//   (config) => {
//     //
//     console.log("Upload Request", {
//       method: config.method?.toUpperCase(),
//       url: `${config.baseURL}${config.url}`,
//       dataType:
//         config.data instanceof FormData ? "FormData" : typeof config.data
//     });
//     return config;
//   },
//   (error) => {
//     console.error("Upload Request Error:", error);
//     return Promise.reject(error);
//   }
// );

// // Response Interceptor for upload API
// CompleteSignupApi.interceptors.response.use(
//   (response) => {
//     console.log("Upload Response:", response.status, response.data);
//     return response;
//   },
//   (error) => {
//     console.error("Upload Response Error:", {
//       message: error.message,
//       code: error.code,
//       response: error.response?.data,
//       status: error.response?.status,
//       url: error.config?.url
//     });
//     return Promise.reject(error);
//   }
// );

export default api;
