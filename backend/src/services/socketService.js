/**
 * Service: Socket.IO
 * Путь: backend/src/services/socketService.js
 */
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import roomManager from "./roomManager.js";
import logger from "../config/logger.js";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || "http://localhost:5173",
      credentials: true,
    },
  });

  // Middleware: аутентификация
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error("Токен не предоставлен"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      if (!user) return next(new Error("Пользователь не найден"));

      socket.userId = user._id.toString();
      socket.nickname = user.nickname;
      next();
    } catch (error) {
      logger.error("Socket auth error:", error);
      next(new Error("Ошибка аутентификации"));
    }
  });

  io.on("connection", (socket) => {
    logger.info(`✅ ${socket.nickname} connected (${socket.id})`);

    // ========== ROOM EVENTS ==========

    /**
     * Присоединиться к комнате
     */
    socket.on("room:join", ({ room }) => {
      try {
        const counts = roomManager.joinRoom(socket, socket.userId, room);

        // Отправляем клиенту подтверждение
        socket.emit("room:joined", { room, counts });

        // Уведомляем всех в комнате о новом участнике
        socket.to(room).emit("room:user-joined", {
          userId: socket.userId,
          nickname: socket.nickname,
          counts,
        });

        // Обновляем счётчики для всех
        io.emit("room:counts", counts);
      } catch (error) {
        socket.emit("error", { message: error.message });
      }
    });

    /**
     * Покинуть комнату
     */
    socket.on("room:leave", () => {
      const room = roomManager.getUserRoom(socket.userId);
      if (!room) return;

      const counts = roomManager.leaveRoom(socket, socket.userId);

      // Уведомляем комнату об уходе
      io.to(room).emit("room:user-left", {
        userId: socket.userId,
        nickname: socket.nickname,
        counts,
      });

      // Обновляем счётчики
      io.emit("room:counts", counts);
    });

    /**
     * Получить список комнат
     */
    socket.on("room:list", () => {
      socket.emit("room:list", roomManager.getAvailableRooms());
    });

    // ========== DISCONNECT ==========

    socket.on("disconnect", () => {
      const room = roomManager.getUserRoom(socket.userId);

      if (room) {
        const counts = roomManager.leaveRoom(socket, socket.userId);

        // Уведомляем комнату
        io.to(room).emit("room:user-left", {
          userId: socket.userId,
          nickname: socket.nickname,
          counts,
        });

        // Обновляем счётчики
        io.emit("room:counts", counts);
      }

      logger.info(`❌ ${socket.nickname} disconnected`);
    });

    // ========== ERROR HANDLING ==========

    socket.on("error", (error) => {
      logger.error(`Socket error for ${socket.nickname}:`, error);
    });
  });

  logger.info("🔌 Socket.IO инициализирован");
  return io;
};

/**
 * Отправить сообщение в комнату
 */
export const sendMessageToRoom = (roomName, event, data) => {
  if (!io) throw new Error("Socket.IO не инициализирован");
  io.to(roomName).emit(event, data);
};

export const getIO = () => {
  if (!io) throw new Error("Socket.IO не инициализирован");
  return io;
};
