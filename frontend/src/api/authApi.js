import request from '../utils/request';

/**
 * API для авторизации
 */

// Регистрация
export const register = async (data) => {
  return request.post('/auth/register', data);
};

// Авторизация
export const login = async (data) => {
  return request.post('/auth/login', data);
};

// Запрос восстановления пароля
export const forgotPassword = async (email) => {
  return request.post('/auth/forgot-password', { email });
};

// Сброс пароля
export const resetPassword = async (token, password) => {
  return request.post(`/auth/reset-password/${token}`, { password });
};