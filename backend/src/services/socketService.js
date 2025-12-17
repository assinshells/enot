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
      socket.userColor = user.color || "black";
      socket.userGender = user.gender || "unknown";
      next();
    } catch (error) {
      logger.error("Socket auth error:", error);
      next(new Error("Ошибка аутентификации"));
    }
  });

  io.on("connection", (socket) => {
    logger.info(`✅ ${socket.nickname} connected (${socket.id})`);

    socket.on("room:join", async ({ room }) => {
      try {
        const counts = roomManager.joinRoom(socket, socket.userId, room);

        socket.emit("room:joined", { room, counts });

        socket.to(room).emit("room:user-joined", {
          userId: socket.userId,
          nickname: socket.nickname,
          counts,
        });

        io.emit("room:counts", counts);

        const users = await getUsersInRoom(room);
        io.to(room).emit("room:users", users);
      } catch (error) {
        socket.emit("error", { message: error.message });
      }
    });

    socket.on("room:leave", async () => {
      const room = roomManager.getUserRoom(socket.userId);
      if (!room) return;

      const counts = roomManager.leaveRoom(socket, socket.userId);

      io.to(room).emit("room:user-left", {
        userId: socket.userId,
        nickname: socket.nickname,
        counts,
      });

      io.emit("room:counts", counts);

      const users = await getUsersInRoom(room);
      io.to(room).emit("room:users", users);
    });

    socket.on("room:list", () => {
      socket.emit("room:list", roomManager.getAvailableRooms());
    });

    socket.on("disconnect", async () => {
      const room = roomManager.getUserRoom(socket.userId);

      if (room) {
        const counts = roomManager.leaveRoom(socket, socket.userId);

        io.to(room).emit("room:user-left", {
          userId: socket.userId,
          nickname: socket.nickname,
          counts,
        });

        io.emit("room:counts", counts);

        const users = await getUsersInRoom(room);
        io.to(room).emit("room:users", users);
      }

      logger.info(`❌ ${socket.nickname} disconnected`);
    });

    socket.on("error", (error) => {
      logger.error(`Socket error for ${socket.nickname}:`, error);
    });
  });

  logger.info("🔌 Socket.IO инициализирован");
  return io;
};

// Вспомогательная функция для получения пользователей в комнате
async function getUsersInRoom(roomName) {
  const sockets = await io.in(roomName).fetchSockets();
  const userIds = sockets.map((s) => s.userId);

  const users = await User.find({ _id: { $in: userIds } }).select(
    "nickname color gender"
  );

  return users;
}

export const sendMessageToRoom = (roomName, event, data) => {
  if (!io) throw new Error("Socket.IO не инициализирован");
  io.to(roomName).emit(event, data);
};

export const getIO = () => {
  if (!io) throw new Error("Socket.IO не инициализирован");
  return io;
};
