/**
 * Socket.IO Rate Limiter
 * Путь: backend/src/services/socketHandlers/rateLimiter.js
 */
import { RateLimiterMemory } from "rate-limiter-flexible";
import logger from "../../config/logger.js";

// Rate limiters для різних типів подій
const limiters = {
  // Обмеження на надсилання повідомлень
  message: new RateLimiterMemory({
    points: 10, // 10 повідомлень
    duration: 60, // за 60 секунд
  }),

  // Обмеження на перемикання кімнат
  roomSwitch: new RateLimiterMemory({
    points: 5, // 5 перемикань
    duration: 60, // за 60 секунд
  }),

  // Обмеження на загальні події
  general: new RateLimiterMemory({
    points: 30, // 30 подій
    duration: 60, // за 60 секунд
  }),
};

/**
 * Middleware для rate limiting Socket.IO подій
 */
export const socketRateLimiter = (limiterType = "general") => {
  return async (socket, next) => {
    const limiter = limiters[limiterType] || limiters.general;
    const userId = socket.userId || socket.id;

    try {
      await limiter.consume(userId);
      next();
    } catch (rejRes) {
      logger.warn(`Rate limit exceeded for user ${userId} on ${limiterType}`, {
        userId,
        limiterType,
        remainingPoints: rejRes.remainingPoints,
      });

      socket.emit("error", {
        message: "Слишком много запросов. Пожалуйста, подождите.",
        code: "RATE_LIMIT_EXCEEDED",
        retryAfter: Math.ceil(rejRes.msBeforeNext / 1000),
      });

      // Не викликаємо next() - блокуємо подію
    }
  };
};

/**
 * Перевірка rate limit без блокування
 */
export const checkRateLimit = async (userId, limiterType = "general") => {
  const limiter = limiters[limiterType];

  try {
    await limiter.consume(userId);
    return { allowed: true };
  } catch (rejRes) {
    return {
      allowed: false,
      retryAfter: Math.ceil(rejRes.msBeforeNext / 1000),
    };
  }
};

/**
 * Скинути rate limit для користувача
 */
export const resetRateLimit = async (userId, limiterType = "general") => {
  const limiter = limiters[limiterType];
  try {
    await limiter.delete(userId);
    logger.info(`Rate limit reset for user ${userId} on ${limiterType}`);
  } catch (error) {
    logger.error(`Failed to reset rate limit for user ${userId}:`, error);
  }
};

/**
 * Отримати залишкові точки
 */
export const getRemainingPoints = async (userId, limiterType = "general") => {
  const limiter = limiters[limiterType];
  try {
    const rateLimiterRes = await limiter.get(userId);
    if (!rateLimiterRes) {
      return limiters[limiterType].points;
    }
    return rateLimiterRes.remainingPoints;
  } catch (error) {
    logger.error(`Failed to get remaining points for user ${userId}:`, error);
    return 0;
  }
};
