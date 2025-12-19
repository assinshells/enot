/**
 * Shared Constants for Backend
 */

export const ROOM_NAMES = ["Главная", "Знакомства", "Беспредел"];

export const DEFAULT_ROOM = ROOM_NAMES[0];

export const isValidRoom = (roomName) => ROOM_NAMES.includes(roomName);

export const GENDER_VALUES = {
  MALE: "male",
  FEMALE: "female",
  UNKNOWN: "unknown",
};

export const COLOR_VALUES = {
  BLACK: "black",
  BLUE: "blue",
  GREEN: "green",
  ORANGE: "orange",
};
