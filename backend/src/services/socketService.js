import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import Message from "../models/messageModel.js";
import roomManager from "./roomManager.js";
import logger from "../config/logger.js";
import { SYSTEM_MESSAGE_TYPES } from "../constants/systemMessages.js";
import { formatSystemMessage } from "../utils/systemMessageFormatter.js";

let io;

const createSystemMessage = async (type, users, room, targetRoom = null) => {
  const text = formatSystemMessage(type, users, targetRoom);
  if (!text) return null;

  const systemData = {
    users: users.map((u) => ({
      userId: u._id,
      nickname: u.nickname,
      color: u.color,
      gender: u.gender,
    })),
  };

  if (targetRoom) {
    systemData.targetRoom = targetRoom;
  }

  const message = await Message.create({
    type: "system",
    room,
    text,
    systemData,
  });

  return message;
};

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || "http://localhost:5173",
      credentials: true,
    },
  });

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
        const oldRoom = roomManager.getUserRoom(socket.userId);

        // Если уже в этой комнате - игнорируем
        if (oldRoom === room) {
          socket.emit("room:joined", {
            room,
            counts: roomManager.getRoomCounts(),
          });
          return;
        }

        const counts = roomManager.joinRoom(socket, socket.userId, room);

        socket.emit("room:joined", { room, counts });

        const user = await User.findById(socket.userId).select(
          "nickname color gender"
        );

        // Если переход из другой комнаты - создаём сообщение о переходе в старой
        if (oldRoom) {
          const switchMessage = await createSystemMessage(
            SYSTEM_MESSAGE_TYPES.SWITCH,
            [user],
            oldRoom,
            room
          );

          if (switchMessage) {
            io.to(oldRoom).emit("message:new", {
              _id: switchMessage._id,
              type: switchMessage.type,
              room: switchMessage.room,
              text: switchMessage.text,
              systemData: switchMessage.systemData,
              createdAt: switchMessage.createdAt,
            });
          }

          const oldRoomUsers = await getUsersInRoom(oldRoom);
          io.to(oldRoom).emit("room:users", oldRoomUsers);
        }

        // Сообщение о входе в новую комнату
        const joinMessage = await createSystemMessage(
          SYSTEM_MESSAGE_TYPES.JOIN,
          [user],
          room
        );

        if (joinMessage) {
          io.to(room).emit("message:new", {
            _id: joinMessage._id,
            type: joinMessage.type,
            room: joinMessage.room,
            text: joinMessage.text,
            systemData: joinMessage.systemData,
            createdAt: joinMessage.createdAt,
          });
        }

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

      // НЕ создаём системное сообщение при явном room:leave
      // Оно будет создано при переходе в другую комнату или disconnect

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
        const user = await User.findById(socket.userId).select(
          "nickname color gender"
        );
        const systemMessage = await createSystemMessage(
          SYSTEM_MESSAGE_TYPES.LEAVE,
          [user],
          room
        );

        if (systemMessage) {
          io.to(room).emit("message:new", {
            _id: systemMessage._id,
            type: systemMessage.type,
            room: systemMessage.room,
            text: systemMessage.text,
            systemData: systemMessage.systemData,
            createdAt: systemMessage.createdAt,
          });
        }

        const counts = roomManager.leaveRoom(socket, socket.userId);
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
