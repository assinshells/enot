import { useEffect, useState, useCallback } from "react";
import { socketLib } from "@/shared/lib/socket/socket";

/**
 * Хук для работы с Socket.IO событиями
 * @param {string} event - Имя события
 * @param {Function} handler - Обработчик события
 */
export const useSocketEvent = (event, handler) => {
  useEffect(() => {
    const socket = socketLib.getSocket();
    if (!socket || !handler) return;

    socket.on(event, handler);
    return () => socket.off(event, handler);
  }, [event, handler]);
};

/**
 * Хук для получения состояния подключения Socket.IO
 */
export const useSocketConnection = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = socketLib.getSocket();
    if (!socket) return;

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    if (socket.connected) {
      setIsConnected(true);
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, []);

  return isConnected;
};

/**
 * Хук для emit событий Socket.IO
 */
export const useSocketEmit = () => {
  const emit = useCallback((event, data) => {
    const socket = socketLib.getSocket();
    if (!socket?.connected) {
      console.warn("Socket not connected");
      return false;
    }
    socket.emit(event, data);
    return true;
  }, []);

  return emit;
};
