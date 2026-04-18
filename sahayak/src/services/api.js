/**
 * Centralized Axios API Client
 * 
 * All frontend-to-backend communication flows through this instance.
 * Automatically injects the Firebase Bearer token for authenticated routes,
 * and handles token refresh / logout on 401.
 */
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request Interceptor ─────────────────────────────────────
// Attach the Firebase ID token to every outbound request.
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('sahayak_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor ────────────────────────────────────
// On 401, clear local session and redirect to /auth.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('sahayak_token');
      localStorage.removeItem('sahayak_user');
      // Only redirect if not already on auth page
      if (!window.location.pathname.startsWith('/auth')) {
        window.location.href = '/auth';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
