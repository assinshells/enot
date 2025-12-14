import { useState, useEffect } from "react";
import { DEFAULT_ROOM, isValidRoom } from "@/shared/config/rooms";

const STORAGE_KEY = "initialRoom";

export const useRoomStorage = () => {
  const getInitialRoom = () => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored && isValidRoom(stored) ? stored : DEFAULT_ROOM;
  };

  const [initialRoom] = useState(getInitialRoom);

  useEffect(() => {
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  const saveRoom = (room) => {
    if (isValidRoom(room)) {
      sessionStorage.setItem(STORAGE_KEY, room);
    }
  };

  return { initialRoom, saveRoom };
};
