import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("cakecraftToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getApiError = (error: unknown, fallback = "Something went wrong. Please try again.") =>
  axios.isAxiosError(error) ? error.response?.data?.message ?? fallback : fallback;
