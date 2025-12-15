import { request } from "@/shared/api/request";

export const authApi = {
  // Проверка существования пользователя
  checkUser: async (nickname) => {
    return request.post("/auth/check-user", { nickname });
  },

  // Регистрация с email и капчей
  register: async (data) => {
    return request.post("/auth/register", data);
  },

  // Авторизация
  login: async (data) => {
    return request.post("/auth/login", data);
  },

  // Пометить пользователя как не нового
  markUserSeen: async () => {
    return request.post("/auth/mark-user-seen");
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
