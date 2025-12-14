/**
 * Shared Lib: Socket.IO Client
 * Путь: src/shared/lib/socket/socket.js
 */
import { io } from "socket.io-client";
import { tokenLib } from "@/shared/lib/token/token";

let socket = null;

export const socketLib = {
  /**
   * Подключиться к Socket.IO серверу
   */
  connect: () => {
    if (socket?.connected) {
      return socket;
    }

    const token = tokenLib.get();
    if (!token) {
      console.warn("Нет токена для подключения к Socket.IO");
      return null;
    }

    const url =
      import.meta.env.VITE_API_URL?.replace("/api", "") ||
      "http://localhost:5000";

    socket = io(url, {
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socket.on("connect", () => {
      console.log("✅ Socket.IO подключен");
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Socket.IO отключен:", reason);
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Socket.IO ошибка подключения:", error.message);
    });

    return socket;
  },

  /**
   * Отключиться от Socket.IO
   */
  disconnect: () => {
    if (socket) {
      socket.disconnect();
      socket = null;
      console.log("Socket.IO отключен вручную");
    }
  },

  /**
   * Получить текущий socket
   */
  getSocket: () => {
    return socket;
  },

  /**
   * Подписаться на событие
   */
  on: (event, callback) => {
    if (!socket) {
      console.warn("Socket не подключен");
      return;
    }
    socket.on(event, callback);
  },

  /**
   * Отписаться от события
   */
  off: (event, callback) => {
    if (!socket) return;
    socket.off(event, callback);
  },

  /**
   * Отправить событие
   */
  emit: (event, data) => {
    if (!socket) {
      console.warn("Socket не подключен");
      return;
    }
    socket.emit(event, data);
  },
};
