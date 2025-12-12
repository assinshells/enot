import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db.js';
import logger from './config/logger.js';

// Загрузка переменных окружения
dotenv.config();

const PORT = process.env.PORT || 5000;

// Подключение к MongoDB
connectDB();

// Запуск сервера
const server = app.listen(PORT, () => {
  logger.info(`🚀 Сервер запущен на порту ${PORT} в режиме ${process.env.NODE_ENV || 'development'}`);
});

// Обработка необработанных ошибок
process.on('unhandledRejection', (err) => {
  logger.error(`Необработанная ошибка: ${err.message}`);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  logger.error(`Необработанное исключение: ${err.message}`);
  server.close(() => process.exit(1));
});