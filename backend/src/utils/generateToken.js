import jwt from 'jsonwebtoken';

/**
 * Генерация JWT токена
 * @param {string} id - ID пользователя
 * @returns {string} - JWT токен
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

export default generateToken;