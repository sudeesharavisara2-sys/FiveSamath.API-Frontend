import axios, { AxiosError, AxiosHeaders, type InternalAxiosRequestConfig } from "axios";

// Updated default fallback port to match your backend launchSettings.json (http port 5153)
export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string) || "http://localhost:5153/api";

export const TOKEN_KEY = "fivesamath_token";
export const USER_KEY = "fivesamath_user";

let intentionalLogout = false;

export const beginIntentionalLogout = () => {
  intentionalLogout = true;
};

export const resetIntentionalLogout = () => {
  intentionalLogout = false;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT to every request
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers = AxiosHeaders.from(config.headers);
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

// Global 401 handling -> force logout
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && !intentionalLogout) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;