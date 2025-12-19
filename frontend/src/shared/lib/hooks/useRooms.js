/**
 * Shared Hook: Rooms Management
 * Путь: src/shared/lib/hooks/useRooms.js
 */
import { useState, useEffect, useCallback } from "react";
import { useSocketEvent, useSocketEmit } from "./useSocket";

export const useRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [counts, setCounts] = useState({});
  const [currentRoom, setCurrentRoom] = useState("");
  const emit = useSocketEmit();

  useSocketEvent(
    "room:list",
    useCallback((data) => {
      setRooms(data);
      const newCounts = {};
      data.forEach((r) => (newCounts[r.name] = r.count));
      setCounts(newCounts);
    }, [])
  );

  useSocketEvent("room:counts", setCounts);

  useSocketEvent(
    "room:joined",
    useCallback(({ room }) => {
      setCurrentRoom(room);
    }, [])
  );

  useEffect(() => {
    emit("room:list");
  }, [emit]);

  const changeRoom = useCallback(
    (roomName) => {
      if (roomName === currentRoom) return;

      emit("room:leave");
      setTimeout(() => {
        emit("room:join", { room: roomName });
      }, 50);
    },
    [currentRoom, emit]
  );

  return {
    rooms,
    counts,
    currentRoom,
    changeRoom,
  };
};
