// backend/src/middleware/rateLimiter.js
import { RateLimiterMemory } from "rate-limiter-flexible";

const rateLimiter = new RateLimiterMemory({
  points: 10, // 10 сообщений
  duration: 60, // за 60 секунд
});

export const messageRateLimit = async (req, res, next) => {
  try {
    await rateLimiter.consume(req.user._id.toString());
    next();
  } catch (error) {
    res.status(429).json({
      success: false,
      message: "Слишком много сообщений. Подождите немного.",
    });
  }
};
