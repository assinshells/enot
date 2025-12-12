import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import logger from '../config/logger.js';

/**
 * Middleware для защиты маршрутов
 * Проверяет JWT токен в заголовке Authorization
 */
export const protect = async (req, res, next) => {
  let token;

  // Проверяем наличие токена в заголовке
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Извлекаем токен
      token = req.headers.authorization.split(' ')[1];

      // Верифицируем токен
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Получаем пользователя из БД (без пароля)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        logger.warn(`Попытка доступа с несуществующим пользователем: ${decoded.id}`);
        return res.status(401).json({
          success: false,
          message: 'Пользователь не найден'
        });
      }

      next();
    } catch (error) {
      logger.error(`Ошибка авторизации: ${error.message}`);
      return res.status(401).json({
        success: false,
        message: 'Токен недействителен'
      });
    }
  }

  if (!token) {
    logger.warn('Попытка доступа без токена');
    return res.status(401).json({
      success: false,
      message: 'Не авторизован, токен отсутствует'
    });
  }
};