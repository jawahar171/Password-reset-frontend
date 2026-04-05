// ═══════════════════════════════════════════════
//  src/services/api.js  —  Axios API Service
//
//  Central place for all HTTP calls to the backend.
//  All components import from here — keeps API URLs in one place.
// ═══════════════════════════════════════════════
import axios from "axios";

// Base URL — "proxy" in package.json forwards /api/* to localhost:5000
// In production, set REACT_APP_API_URL in a .env file
const BASE_URL = process.env.REACT_APP_API_URL || "";

// Create a reusable Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ── Request Interceptor ───────────────────────
// Automatically adds the JWT Bearer token to every request if one is stored
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Auth API Calls ────────────────────────────

/** Register a new user */
export const registerUser = (data) => api.post("/api/auth/register", data);

/** Login and receive JWT */
export const loginUser = (data) => api.post("/api/auth/login", data);

/** Send password reset email (Flow 1) */
export const forgotPassword = (email) =>
  api.post("/api/auth/forgot-password", { email });

/** Verify that a reset token is still valid (Flow 2, Step 1) */
export const verifyResetToken = (token) =>
  api.get(`/api/auth/verify-token/${token}`);

/** Submit the new password with the reset token (Flow 2, Step 2) */
export const resetPassword = (token, password, confirmPassword) =>
  api.post(`/api/auth/reset-password/${token}`, { password, confirmPassword });

/** Get the logged-in user's profile */
export const getProfile = () => api.get("/api/user/profile");

export default api;