import axios from "axios";
import { useAuthStore } from "@/utils/auth";
import { refreshToken } from "@/services/auth.service";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8082/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // include cookies if using cookie-based auth
  timeout: 10000, // 10s timeout
});

// 2) Attach access token (from memory) before every request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
// 🚨 Optional: handle global errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // logout or refresh token logic
      console.warn("Unauthorized, redirect to login");
    }
    return Promise.reject(error);
  }
);

//call refresh token to refresh access token
//If server says 401 (token expired), try to refresh once and retry
let isRefreshing = false;
let pending = [];

function queueRequest(cb) {
  pending.push(cb);
}
function resolveQueued(newToken) {
  pending.forEach((cb) => cb(newToken));
  pending = [];
}

// Login/register/refresh/logout khud 401 de sakte hain (galat password etc).
// In par refresh-retry nahi karna — warna original error kho jata hai
// aur UI par sahi message nahi dikhta.
const SKIP_REFRESH_PATTERNS = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/auth/logout",
];

function shouldSkipRefresh(url) {
  if (!url || typeof url !== "string") return false;
  return SKIP_REFRESH_PATTERNS.some((p) => url.includes(p));
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const is401 = error.response?.status === 401;

    if (!is401 || !original || original._retry) return Promise.reject(error);
    // Auth endpoints par refresh try mat karo — original error hi wapas do
    // taaki login/register page sahi backend message dikha sake.
    if (shouldSkipRefresh(original.url)) return Promise.reject(error);
    original._retry = true;

    // If a refresh is already running, wait for it
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queueRequest((newToken) => {
          if (!newToken) return reject(error);
          original.headers.Authorization = `Bearer ${newToken}`;
          resolve(api(original));
        });
      });
    }

    // Start refresh
    isRefreshing = true;
    try {
      const accessToken = await refreshToken();
      const newToken = accessToken.accessToken;
      console.log("new accestoken", newToken);
      if (!newToken) throw new Error("No access token returned");

      // Update memory state
      useAuthStore.getState().setAccessToken(newToken);

      // Resume queued requests
      resolveQueued(newToken);

      // Retry the original request
      original.headers.Authorization = `Bearer ${newToken}`;
      return api(original);
    } catch (err) {
      // Refresh failed: clear auth and fail everyone waiting.
      // NOTE: original error reject karo (refresh wala nahi) taaki
      // login page par "Invalid Username or Password" jaisa sahi
      // backend message dikhe.
      console.warn("Token refresh failed", err?.response?.status);
      resolveQueued(null);
      useAuthStore.getState().logout({ silent: true });
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
