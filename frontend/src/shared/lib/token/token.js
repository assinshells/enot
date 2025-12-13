/**
 * Shared Lib: Token utilities
 * Путь: src/shared/lib/token/token.js
 */
const TOKEN_KEY = "auth_token";

export const tokenLib = {
  set: (token) => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  get: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  remove: () => {
    localStorage.removeItem(TOKEN_KEY);
  },

  has: () => {
    return !!tokenLib.get();
  },
};
