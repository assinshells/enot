/**
 * Утилиты для работы с JWT токеном в localStorage
 */

const TOKEN_KEY = 'auth_token';

/**
 * Сохранить токен
 */
export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Получить токен
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Удалить токен
 */
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Проверить наличие токена
 */
export const hasToken = () => {
  return !!getToken();
};