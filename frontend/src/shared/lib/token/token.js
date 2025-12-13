/**
 * Shared Lib: Token utilities
 * Путь: src/shared/lib/token/token.js
 */
const TOKEN_KEY = "auth_token";

const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expiry = payload.exp * 1000; // Конвертируем в миллисекунды
    return Date.now() >= expiry;
  } catch {
    return true;
  }
};

export const tokenLib = {
  set: (token) => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  get: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    // ✅ Автоматическая очистка истекших токенов
    if (token && isTokenExpired(token)) {
      tokenLib.remove();
      return null;
    }
    return token;
  },

  remove: () => {
    localStorage.removeItem(TOKEN_KEY);
  },

  has: () => {
    return !!tokenLib.get();
  },

  isValid: () => {
    const token = tokenLib.get();
    return token && !isTokenExpired(token);
  },
};
