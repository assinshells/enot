/**
 * Entity: Auth API
 * Путь: src/entities/user/api/authApi.js
 */
import { request } from "@/shared/api/request";

export const authApi = {
  // Регистрация
  register: async (data) => {
    return request.post("/auth/register", data);
  },

  // Авторизация
  login: async (data) => {
    return request.post("/auth/login", data);
  },

  // Восстановление пароля
  forgotPassword: async (email) => {
    return request.post("/auth/forgot-password", { email });
  },

  // Сброс пароля
  resetPassword: async (token, password) => {
    return request.post(`/auth/reset-password/${token}`, { password });
  },
};
