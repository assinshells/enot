/**
 * Shared Lib: Time Formatting
 * Путь: src/shared/lib/utils/formatTime.js
 */

/**
 * Форматирование времени для сообщений
 * @param {string|Date} date - Дата
 * @returns {string} - Отформатированное время (HH:MM)
 */
export const formatTime = (date) => {
  if (!date) return "";

  const d = new Date(date);
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
};

/**
 * Форматирование полной даты
 * @param {string|Date} date - Дата
 * @returns {string} - Отформатированная дата (DD.MM.YYYY)
 */
export const formatDate = (date) => {
  if (!date) return "";

  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}.${month}.${year}`;
};

/**
 * Форматирование даты и времени
 * @param {string|Date} date - Дата
 * @returns {string} - Отформатированная дата и время (DD.MM.YYYY HH:MM)
 */
export const formatDateTime = (date) => {
  if (!date) return "";

  return `${formatDate(date)} ${formatTime(date)}`;
};
