import axios from "axios";

// ✅ Handle both CRA and Vite environments
const BASE_URL =
  process.env.REACT_APP_API_URL ||
  import.meta.env?.VITE_API_URL ||
  "https://password-reset-backend-fsr0.onrender.com";

// ✅ Create axios instance
const api = axios.create({
  baseURL: BASE_URL.replace(/\/+$/, ""), // remove trailing slash
  headers: { "Content-Type": "application/json" },
  timeout: 30000, // increased for Render cold start
});

// ✅ Request interceptor (Attach JWT)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token && token !== "undefined" && token !== "null") {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor (Global error handling)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network / server down
    if (!error.response) {
      console.error("Network error:", error.message);
      return Promise.reject(error);
    }

    // Unauthorized → logout user
    if (error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.replace("/login"); // better than href
    }

    return Promise.reject(error);
  }
);

// ✅ Auth APIs
export const registerUser = (data) =>
  api.post("/api/auth/register", data);

export const loginUser = (data) =>
  api.post("/api/auth/login", data);

export const forgotPassword = (email) =>
  api.post("/api/auth/forgot-password", { email });

export const verifyResetToken = (token) =>
  api.get(`/api/auth/verify-token/${token}`);

export const resetPassword = (token, password, confirmPassword) =>
  api.post(`/api/auth/reset-password/${token}`, {
    password,
    confirmPassword,
  });

// ✅ User APIs
export const getProfile = () =>
  api.get("/api/user/profile");

// ✅ Export instance
export default api;