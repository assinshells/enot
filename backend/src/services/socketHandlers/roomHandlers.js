/**
 * Room Handlers - Обробники подій кімнат
 * Винесено з socketService для кращої модульності
 */
import roomManager from "../roomManager.js";
import messageService from "../messageService.js";
import User from "../../models/userModel.js";
import logger from "../../config/logger.js";
import { SYSTEM_MESSAGE_TYPES } from "../../shared/constants.js";

/**
 * Отримати користувачів у кімнаті
 */
async function getUsersInRoom(io, roomName) {
  try {
    const sockets = await io.in(roomName).fetchSockets();
    const userIds = sockets.map((s) => s.userId);

    const users = await User.find({ _id: { $in: userIds } }).select(
      "nickname color gender"
    );

    return users;
  } catch (error) {
    logger.error("Error fetching users in room:", error);
    return [];
  }
}

/**
 * Обробник приєднання до кімнати
 */
export async function handleRoomJoin(io, socket, { room }) {
  try {
    const oldRoom = roomManager.getUserRoom(socket.userId);
    const user = await User.findById(socket.userId).select(
      "nickname color gender"
    );

    if (!user) {
      throw new Error("User not found");
    }

    // Якщо вже в цій кімнаті
    if (oldRoom === room) {
      socket.emit("room:joined", {
        room,
        counts: roomManager.getRoomCounts(),
      });
      return;
    }

    // Якщо був в іншій кімнаті
    if (oldRoom) {
      const switchMessage = await messageService.createSystemMessage(
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

      const oldRoomUsers = await getUsersInRoom(io, oldRoom);
      io.to(oldRoom).emit("room:users", oldRoomUsers);
    }

    // Приєднання до нової кімнати
    const counts = roomManager.joinRoom(socket, socket.userId, room);
    socket.emit("room:joined", { room, counts });

    // Системне повідомлення про приєднання
    const joinMessage = await messageService.createSystemMessage(
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

    // Оновити лічильники та список користувачів
    io.emit("room:counts", counts);

    const users = await getUsersInRoom(io, room);
    io.to(room).emit("room:users", users);

    logger.info(`User ${socket.nickname} joined room ${room}`);
  } catch (error) {
    logger.error(`Error in room:join: ${error.message}`);
    socket.emit("error", { message: error.message });
  }
}

/**
 * Обробник виходу з кімнати
 */
export async function handleRoomLeave(io, socket) {
  try {
    const room = roomManager.getUserRoom(socket.userId);
    if (!room) return;

    const counts = roomManager.leaveRoom(socket, socket.userId);
    io.emit("room:counts", counts);

    const users = await getUsersInRoom(io, room);
    io.to(room).emit("room:users", users);

    logger.info(`User ${socket.nickname} left room ${room}`);
  } catch (error) {
    logger.error("Error in room:leave:", error);
  }
}

/**
 * Обробник запиту списку кімнат
 */
export function handleRoomList(socket) {
  try {
    socket.emit("room:list", roomManager.getAvailableRooms());
  } catch (error) {
    logger.error("Error in room:list:", error);
    socket.emit("error", { message: "Failed to fetch room list" });
  }
}

/**
 * Обробник відключення (системне повідомлення про вихід)
 */
export async function handleDisconnect(io, socket) {
  try {
    const room = roomManager.getUserRoom(socket.userId);

    if (room) {
      const user = await User.findById(socket.userId).select(
        "nickname color gender"
      );

      if (user) {
        const systemMessage = await messageService.createSystemMessage(
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
      }

      const counts = roomManager.leaveRoom(socket, socket.userId);
      io.emit("room:counts", counts);

      const users = await getUsersInRoom(io, room);
      io.to(room).emit("room:users", users);
    }

    logger.info(`User ${socket.nickname} disconnected`);
  } catch (error) {
    logger.error("Error in disconnect handler:", error);
  }
}
