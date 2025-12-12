import mongoose from 'mongoose';
import logger from './logger.js';

/**
 * Подключение к MongoDB
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    logger.info(`MongoDB подключен: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`Ошибка подключения к MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;