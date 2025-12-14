// frontend/src/shared/lib/validation/validators.js
export const validators = {
  nickname: (value) => {
    if (!value || value.trim().length < 3) {
      return "Никнейм должен быть минимум 3 символа";
    }
    if (value.trim().length > 30) {
      return "Никнейм не должен превышать 30 символов";
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
      return "Никнейм может содержать только латинские буквы, цифры, _ и -";
    }
    return null;
  },

  email: (value) => {
    if (!value) return null; // email опциональный

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return "Введите корректный email";
    }
    return null;
  },

  password: (value) => {
    if (!value || value.length < 6) {
      return "Пароль должен быть минимум 6 символов";
    }
    if (value.length > 128) {
      return "Пароль слишком длинный";
    }
    return null;
  },

  message: (value) => {
    if (!value || value.trim().length === 0) {
      return "Сообщение не может быть пустым";
    }
    if (value.trim().length > 1000) {
      return "Сообщение слишком длинное (макс. 1000 символов)";
    }
    return null;
  },
};
