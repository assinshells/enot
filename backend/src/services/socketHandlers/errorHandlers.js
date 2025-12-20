/**
 * Error Handlers - Централізована обробка помилок Socket.IO
 * Винесено з socketService для кращої модульності
 */
import logger from "../../config/logger.js";

/**
 * Централізований обробник помилок Socket.IO
 */
export function handleSocketError(socket, error, context = {}) {
  const errorInfo = {
    socketId: socket.id,
    userId: socket.userId,
    nickname: socket.nickname,
    message: error.message,
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    context,
    timestamp: new Date().toISOString(),
  };

  logger.error("Socket.IO error occurred:", errorInfo);

  // Відправляємо помилку клієнту
  socket.emit("error", {
    message: getClientErrorMessage(error),
    code: error.code || "INTERNAL_ERROR",
  });
}

/**
 * Обробник помилок валідації
 */
export function handleValidationError(socket, error, field) {
  logger.warn("Validation error:", {
    socketId: socket.id,
    userId: socket.userId,
    field,
    message: error.message,
  });

  socket.emit("error", {
    message: error.message,
    code: "VALIDATION_ERROR",
    field,
  });
}

/**
 * Обробник помилок автентифікації
 */
export function handleAuthError(socket, error) {
  logger.warn("Authentication error:", {
    socketId: socket.id,
    message: error.message,
  });

  socket.emit("error", {
    message: "Authentication failed",
    code: "AUTH_ERROR",
  });

  // Відключаємо сокет
  socket.disconnect(true);
}

/**
 * Обробник помилок кімнат
 */
export function handleRoomError(socket, error, roomName) {
  logger.error("Room error:", {
    socketId: socket.id,
    userId: socket.userId,
    roomName,
    message: error.message,
  });

  socket.emit("error", {
    message: `Room error: ${error.message}`,
    code: "ROOM_ERROR",
    room: roomName,
  });
}

/**
 * Обробник помилок повідомлень
 */
export function handleMessageError(socket, error, messageData) {
  logger.error("Message error:", {
    socketId: socket.id,
    userId: socket.userId,
    message: error.message,
    messageData,
  });

  socket.emit("error", {
    message: "Failed to send message",
    code: "MESSAGE_ERROR",
  });
}

/**
 * Обробник помилок rate limiting
 */
export function handleRateLimitError(socket, resource) {
  logger.warn("Rate limit exceeded:", {
    socketId: socket.id,
    userId: socket.userId,
    resource,
  });

  socket.emit("error", {
    message: "Too many requests. Please slow down.",
    code: "RATE_LIMIT_ERROR",
    resource,
  });
}

/**
 * Обробник критичних помилок
 */
export function handleCriticalError(io, error) {
  logger.error("Critical Socket.IO error:", {
    message: error.message,
    stack: error.stack,
  });

  // Можна додати логіку сповіщення адміністраторів
  // або автоматичного перезапуску сервісу
}

/**
 * Отримати повідомлення про помилку для клієнта
 */
function getClientErrorMessage(error) {
  // У production не показуємо технічні деталі
  if (process.env.NODE_ENV === "production") {
    // Мапа загальних помилок
    const errorMessages = {
      ECONNREFUSED: "Connection refused",
      ETIMEDOUT: "Connection timeout",
      ENOTFOUND: "Server not found",
    };

    return errorMessages[error.code] || "An error occurred";
  }

  // У development показуємо детальні помилки
  return error.message;
}

/**
 * Wrapper для безпечного виконання async функцій в Socket.IO
 */
export function wrapSocketHandler(handler) {
  return async (socket, ...args) => {
    try {
      await handler(socket, ...args);
    } catch (error) {
      handleSocketError(socket, error, {
        handler: handler.name,
        args,
      });
    }
  };
}

/**
 * Обробник непередбачених винятків
 */
export function handleUncaughtException(error) {
  logger.error("Uncaught exception in Socket.IO:", {
    message: error.message,
    stack: error.stack,
  });

  // Не завершуємо процес, але логуємо критичну помилку
}
