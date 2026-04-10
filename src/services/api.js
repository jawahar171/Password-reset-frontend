import axios from "axios";

const BASE_URL =
  process.env.REACT_APP_API_URL ||
  "https://password-reset-backend-fsr0.onrender.com";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT to every request automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export const registerUser    = (data)             => api.post("/api/auth/register", data);
export const loginUser       = (data)             => api.post("/api/auth/login", data);
export const forgotPassword  = (email)            => api.post("/api/auth/forgot-password", { email });
export const verifyResetToken = (token)           => api.get(`/api/auth/verify-token/${token}`);
export const resetPassword   = (token, password, confirmPassword) =>
  api.post(`/api/auth/reset-password/${token}`, { password, confirmPassword });
export const getProfile      = ()                 => api.get("/api/user/profile");

export default api;