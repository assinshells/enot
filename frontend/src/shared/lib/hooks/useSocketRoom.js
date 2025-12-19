import { useEffect, useCallback } from "react";
import { useSocketEmit } from "./useSocket";

/**
 * Хук для управления подключением к комнате через Socket.IO
 */
export const useSocketRoom = (roomName) => {
  const emit = useSocketEmit();

  const joinRoom = useCallback(() => {
    if (!roomName) return;
    emit("room:join", { room: roomName });
  }, [roomName, emit]);

  const leaveRoom = useCallback(() => {
    emit("room:leave");
  }, [emit]);

  useEffect(() => {
    joinRoom();
    return () => {
      leaveRoom();
    };
  }, [joinRoom, leaveRoom]);

  return { joinRoom, leaveRoom };
};
