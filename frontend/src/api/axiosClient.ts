import axios from "axios";

const baseURL =
  (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:8000/api/";

const axiosClient = axios.create({
  baseURL: baseURL,
  headers: { "Content-Type": "application/json" },
});

// attach token if present
axiosClient.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("access_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch (e) {}
  return config;
});

export default axiosClient;
