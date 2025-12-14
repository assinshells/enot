import { TOKEN_MAX_AGE, TOKEN_REFRESH_BUFFER } from "@/shared/config/constants";

const TOKEN_KEY = "auth_token";
const TIMESTAMP_KEY = `${TOKEN_KEY}_timestamp`;

const setTokenWithSecurity = (token) => {
  if (!token) {
    console.warn("Попытка сохранить пустой токен");
    return;
  }

  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(TIMESTAMP_KEY, Date.now().toString());
};

const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expiry = payload.exp * 1000;
    return Date.now() >= expiry - TOKEN_REFRESH_BUFFER;
  } catch {
    return true;
  }
};

export const tokenLib = {
  set: setTokenWithSecurity,

  get: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    const timestamp = localStorage.getItem(TIMESTAMP_KEY);

    if (timestamp) {
      const age = Date.now() - parseInt(timestamp, 10);
      if (age > TOKEN_MAX_AGE) {
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
    localStorage.removeItem(TIMESTAMP_KEY);
  },

  has: () => !!tokenLib.get(),
  isValid: () => !!tokenLib.get(),
};
