import crypto from 'crypto';

/**
 * Генерация токена для сброса пароля
 * @returns {string} - Токен сброса пароля
 */
export const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Хеширование токена сброса пароля
 * @param {string} token - Токен для хеширования
 * @returns {string} - Хешированный токен
 */
export const hashResetToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};