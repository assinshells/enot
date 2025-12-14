/**
 * Service: Socket.IO
 * Путь: backend/src/services/socketService.js
 */
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import logger from "../config/logger.js";

let io;

/**
 * Инициализация Socket.IO
 */
export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || "http://localhost:5173",
      credentials: true,
    },
  });

  // Middleware для аутентификации
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error("Токен не предоставлен"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return next(new Error("Пользователь не найден"));
      }

      socket.userId = user._id.toString();
      socket.nickname = user.nickname;
      next();
    } catch (error) {
      logger.error("Socket auth error:", error);
      next(new Error("Ошибка аутентификации"));
    }
  });

  io.on("connection", (socket) => {
    logger.info(`✅ Пользователь подключен: ${socket.nickname} (${socket.id})`);

    // Отправка приветственного сообщения
    socket.emit("connected", {
      message: "Подключено к чату",
      userId: socket.userId,
    });

    // Отключение
    socket.on("disconnect", () => {
      logger.info(
        `❌ Пользователь отключен: ${socket.nickname} (${socket.id})`
      );
    });

    // Обработка ошибок
    socket.on("error", (error) => {
      logger.error(`Socket error for ${socket.nickname}:`, error);
    });
  });

  logger.info("🔌 Socket.IO инициализирован");
  return io;
};

/**
 * Получить экземпляр io
 */
export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO не инициализирован");
  }
  return io;
};
