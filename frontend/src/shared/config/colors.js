/**
 * Shared Config: Color Constants
 * Путь: frontend/src/shared/config/colors.js
 */

export const COLOR_VALUES = {
  black: "#000000",
  blue: "#0d6efd",
  green: "#198754",
  orange: "#fd7e14",
};

export const COLOR_OPTIONS = [
  { value: "black", label: "Черный", color: COLOR_VALUES.black },
  { value: "blue", label: "Синий", color: COLOR_VALUES.blue },
  { value: "green", label: "Зеленый", color: COLOR_VALUES.green },
  { value: "orange", label: "Оранжевый", color: COLOR_VALUES.orange },
];

export const getColorValue = (colorKey) => {
  return COLOR_VALUES[colorKey] || COLOR_VALUES.black;
};
