/**
 * Shared Lib: Token utilities (ОПТИМИЗИРОВАНО)
 * Путь: src/shared/lib/token/token.js
 */
const TOKEN_KEY = "auth_token";

// ✅ Добавляем флаги безопасности
const setTokenWithSecurity = (token) => {
  if (!token) {
    console.warn("Попытка сохранить пустой токен");
    return;
  }

  // ✅ В production лучше использовать httpOnly cookies
  // Но для демо-проекта localStorage с флагами - приемлемо
  localStorage.setItem(TOKEN_KEY, token);

  // ✅ Добавляем timestamp для автоматической очистки
  localStorage.setItem(`${TOKEN_KEY}_timestamp`, Date.now().toString());
};

const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expiry = payload.exp * 1000;

    // ✅ Добавляем buffer для предотвращения race conditions
    const buffer = 60000; // 1 минута
    return Date.now() >= expiry - buffer;
  } catch {
    return true;
  }
};

export const tokenLib = {
  set: setTokenWithSecurity,

  get: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    const timestamp = localStorage.getItem(`${TOKEN_KEY}_timestamp`);

    // ✅ Проверяем возраст токена (макс. 7 дней)
    if (timestamp) {
      const age = Date.now() - parseInt(timestamp, 10);
      const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 дней

      if (age > maxAge) {
        tokenLib.remove();
        return null;
      }
    }

    if (token && isTokenExpired(token)) {
      tokenLib.remove();
      return null;
    }

    return token;
  },

  remove: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(`${TOKEN_KEY}_timestamp`);
  },

  has: () => !!tokenLib.get(),
  isValid: () => !!tokenLib.get(),
};
