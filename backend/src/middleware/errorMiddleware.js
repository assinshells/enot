import logger from '../config/logger.js';

/**
 * Middleware для обработки ошибок
 */
export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Логируем ошибку
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method
  });

  // Ошибка дубликата в MongoDB
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    message = `${field === 'nickname' ? 'Никнейм' : 'Email'} уже используется`;
    statusCode = 400;
  }

  // Ошибка валидации MongoDB
  if (err.name === 'ValidationError') {
    message = Object.values(err.errors)
      .map(val => val.message)
      .join(', ');
    statusCode = 400;
  }

  // Ошибка JWT
  if (err.name === 'JsonWebTokenError') {
    message = 'Недействительный токен';
    statusCode = 401;
  }

  // Ошибка истекшего JWT
  if (err.name === 'TokenExpiredError') {
    message = 'Токен истек';
    statusCode = 401;
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

/**
 * Middleware для несуществующих маршрутов
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Маршрут не найден - ${req.originalUrl}`);
  res.status(404);
  next(error);
};