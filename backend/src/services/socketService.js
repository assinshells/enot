/**
 * Socket Service - Відрефакторений
 * Логіка винесена в окремі handlers
 */
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import logger from "../config/logger.js";
import {
  handleRoomJoin,
  handleRoomLeave,
  handleRoomList,
  handleDisconnect,
} from "./socketHandlers/roomHandlers.js";

let io;

/**
 * Middleware аутентифікації
 */
async function authenticateSocket(socket, next) {
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
    socket.userColor = user.color || "black";
    socket.userGender = user.gender || "unknown";

    next();
  } catch (error) {
    logger.error("Socket auth error:", error);
    next(new Error("Ошибка аутентификации"));
  }
}

/**
 * Реєстрація обробників подій
 */
function registerEventHandlers(socket) {
  // Room events
  socket.on("room:join", (data) => handleRoomJoin(io, socket, data));
  socket.on("room:leave", () => handleRoomLeave(io, socket));
  socket.on("room:list", () => handleRoomList(socket));

  // Disconnect
  socket.on("disconnect", () => handleDisconnect(io, socket));

  // Error handling
  socket.on("error", (error) => {
    logger.error(`Socket error for ${socket.nickname}:`, error);
  });
}

/**
 * Ініціалізація Socket.IO
 */
export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || "http://localhost:5173",
      credentials: true,
    },
  });

  // Middleware
  io.use(authenticateSocket);

  // Connection handler
  io.on("connection", (socket) => {
    logger.info(`✅ ${socket.nickname} connected (${socket.id})`);
    registerEventHandlers(socket);
  });

  logger.info("🔌 Socket.IO інициализирован");
  return io;
};

/**
 * Надіслати повідомлення в кімнату
 */
export const sendMessageToRoom = (roomName, event, data) => {
  if (!io) {
    throw new Error("Socket.IO не инициализирован");
  }
  io.to(roomName).emit(event, data);
};

/**
 * Отримати інстанс Socket.IO
 */
export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO не инициализирован");
  }
  return io;
};
