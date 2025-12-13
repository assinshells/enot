/**
 * Shared API: Configured Axios Instance
 * Путь: src/shared/api/request.js
 */
import axios from "axios";
import { tokenLib } from "@/shared/lib/token/token";

const request = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - добавляем токен
request.interceptors.request.use(
  (config) => {
    const token = tokenLib.get();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - обработка ответов
request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;

    // Обработка различных статусов
    if (status === 401) {
      tokenLib.remove();
      // Редирект только если не на странице авторизации
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }

    if (status === 403) {
      console.error("Access forbidden");
    }

    if (status >= 500) {
      console.error("Server error:", error);
    }

    const message =
      error.response?.data?.message || error.message || "Произошла ошибка";

    return Promise.reject(new Error(message));
  }
);

export { request };
