import {
  MIN_NICKNAME_LENGTH,
  MAX_NICKNAME_LENGTH,
  MIN_PASSWORD_LENGTH,
  MAX_MESSAGE_LENGTH,
} from "@/shared/config/constants";

export const validators = {
  nickname: (value) => {
    if (!value || value.trim().length < MIN_NICKNAME_LENGTH) {
      return `Никнейм должен быть минимум ${MIN_NICKNAME_LENGTH} символа`;
    }
    if (value.trim().length > MAX_NICKNAME_LENGTH) {
      return `Никнейм не должен превышать ${MAX_NICKNAME_LENGTH} символов`;
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
      return "Никнейм может содержать только латинские буквы, цифры, _ и -";
    }
    return null;
  },

  email: (value) => {
    if (!value) return null;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return "Введите корректный email";
    }
    return null;
  },

  password: (value) => {
    if (!value || value.length < MIN_PASSWORD_LENGTH) {
      return `Пароль должен быть минимум ${MIN_PASSWORD_LENGTH} символов`;
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
    if (value.trim().length > MAX_MESSAGE_LENGTH) {
      return `Сообщение слишком длинное (макс. ${MAX_MESSAGE_LENGTH} символов)`;
    }
    return null;
  },
};
