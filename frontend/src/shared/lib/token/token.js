/**
 * Shared Lib: Token utilities (ОПТИМИЗИРОВАНО)
 * Путь: src/shared/lib/token/token.js
 */
const TOKEN_KEY = "auth_token";

/**
 * Проверка истечения токена
 */
const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expiry = payload.exp * 1000;
    return Date.now() >= expiry;
  } catch {
    return true;
  }
};

export const tokenLib = {
  /**
   * Сохранить токен
   */
  set: (token) => {
    if (!token) {
      console.warn("Попытка сохранить пустой токен");
      return;
    }
    localStorage.setItem(TOKEN_KEY, token);
  },

  /**
   * Получить токен (с автоочисткой истекших)
   */
  get: () => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (token && isTokenExpired(token)) {
      tokenLib.remove();
      return null;
    }

    return token;
  },

  /**
   * Удалить токен
   */
  remove: () => {
    localStorage.removeItem(TOKEN_KEY);
  },

  /**
   * Проверить наличие токена
   */
  has: () => {
    return !!tokenLib.get();
  },

  /**
   * Проверить валидность токена
   */
  isValid: () => {
    const token = tokenLib.get();
    return !!token; // get() уже проверяет истечение
  },
};
