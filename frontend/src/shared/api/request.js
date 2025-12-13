/**
 * Shared API: Configured Axios Instance (ОПТИМИЗИРОВАНО)
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

// Request interceptor
request.interceptors.request.use(
  (config) => {
    const token = tokenLib.get();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;
    const pathname = window.location.pathname;

    // Список публичных путей
    const publicPaths = [
      "/login",
      "/register",
      "/forgot-password",
      "/reset-password",
    ];
    const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

    // 401: Неавторизован
    if (status === 401) {
      tokenLib.remove();

      // Редирект только если не на публичной странице
      if (!isPublicPath) {
        window.location.href = "/login";
      }
    }

    // 403: Доступ запрещен
    if (status === 403) {
      console.error("Access forbidden");
    }

    // 500+: Ошибка сервера
    if (status >= 500) {
      console.error("Server error:", error);
    }

    // Формируем сообщение об ошибке
    const message =
      error.response?.data?.message || error.message || "Произошла ошибка";

    return Promise.reject(new Error(message));
  }
);

export { request };
