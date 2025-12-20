/**
 * Connection Handlers - Обробники підключень Socket.IO
 * Винесено з socketService для кращої модульності
 */
import logger from "../../config/logger.js";

/**
 * Обробник успішного підключення
 */
export function handleConnection(socket) {
  logger.info(`✅ User connected: ${socket.nickname} (${socket.id})`);

  // Надсилаємо привітання користувачу
  socket.emit("connection:success", {
    message: "Successfully connected to server",
    socketId: socket.id,
  });

  // Запитуємо список кімнат
  socket.emit("room:list:request");
}

/**
 * Обробник відключення
 */
export function handleDisconnection(socket, reason) {
  logger.info(
    `❌ User disconnected: ${socket.nickname} (${socket.id}), reason: ${reason}`
  );

  // Можна додати логіку очищення даних користувача
  // Наприклад, видалення з кешу активних користувачів
}

/**
 * Обробник помилки підключення
 */
export function handleConnectionError(error) {
  logger.error("Socket connection error:", {
    message: error.message,
    stack: error.stack,
  });
}

/**
 * Обробник повторного підключення
 */
export function handleReconnect(socket, attemptNumber) {
  logger.info(
    `🔄 User reconnected: ${socket.nickname} (${socket.id}) after ${attemptNumber} attempts`
  );

  socket.emit("connection:reconnected", {
    message: "Successfully reconnected",
    attemptNumber,
  });
}

/**
 * Обробник спроби підключення
 */
export function handleReconnectAttempt(socket, attemptNumber) {
  logger.debug(
    `🔄 Reconnection attempt ${attemptNumber} for socket ${socket.id}`
  );
}

/**
 * Обробник помилки повторного підключення
 */
export function handleReconnectError(error) {
  logger.error("Socket reconnection error:", {
    message: error.message,
    code: error.code,
  });
}

/**
 * Обробник невдалого повторного підключення
 */
export function handleReconnectFailed(socket) {
  logger.error(`❌ Reconnection failed for socket ${socket.id}`);

  socket.emit("connection:reconnect_failed", {
    message: "Failed to reconnect after multiple attempts",
  });
}
