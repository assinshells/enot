/**
 * Shared Constants - Централізовані константи
 * Замість дублювання у backend/src/shared/constants.js та інших файлах
 */

// Room Configuration
export const ROOM_NAMES = ["Главная", "Знакомства", "Беспредел"];
export const DEFAULT_ROOM = ROOM_NAMES[0];

export const isValidRoom = (roomName) => ROOM_NAMES.includes(roomName);

// Gender Values
export const GENDER_VALUES = {
  MALE: "male",
  FEMALE: "female",
  UNKNOWN: "unknown",
};

export const GENDER_LIST = Object.values(GENDER_VALUES);

// Color Values
export const COLOR_VALUES = {
  BLACK: "black",
  BLUE: "blue",
  GREEN: "green",
  ORANGE: "orange",
};

export const COLOR_LIST = Object.values(COLOR_VALUES);

// System Message Types
export const SYSTEM_MESSAGE_TYPES = {
  JOIN: "join",
  LEAVE: "leave",
  SWITCH: "switch",
};

// Action Variants for System Messages
export const ACTION_VARIANTS = {
  JOIN: ["вошёл", "вошла", "вошли", "приполз", "приползла", "приползли"],
  LEAVE: ["ушёл", "ушла", "ушли", "уполз", "уползла", "уползли"],
  SWITCH: [
    "перешёл",
    "перешла",
    "перешли",
    "переполз",
    "переползла",
    "переползли",
  ],
};

// Validation Constants
export const VALIDATION = {
  NICKNAME_MIN_LENGTH: 3,
  NICKNAME_MAX_LENGTH: 30,
  PASSWORD_MIN_LENGTH: 6,
  MESSAGE_MAX_LENGTH: 1000,
  EMAIL_REGEX: /^\S+@\S+\.\S+$/,
};

// Message Types
export const MESSAGE_TYPES = {
  USER: "user",
  SYSTEM: "system",
};

// Token Configuration
export const TOKEN_CONFIG = {
  EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
};

// Rate Limiting
export const RATE_LIMITS = {
  MESSAGE: {
    POINTS: 10,
    DURATION: 60,
  },
  ROOM_SWITCH: {
    POINTS: 5,
    DURATION: 60,
  },
};
