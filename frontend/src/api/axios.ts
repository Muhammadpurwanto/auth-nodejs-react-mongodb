import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // backend API
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor untuk attach access token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
