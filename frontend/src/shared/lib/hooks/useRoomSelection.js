import { useState, useCallback, useMemo } from "react";
import { ROOM_NAMES, DEFAULT_ROOM, isValidRoom } from "@/shared/config/rooms";

export const useRoomSelection = (initialRoom = "") => {
  const [selectedRoom, setSelectedRoom] = useState(() => {
    const stored = sessionStorage.getItem("currentRoom");
    return (
      initialRoom || (stored && isValidRoom(stored) ? stored : DEFAULT_ROOM)
    );
  });

  const availableRooms = useMemo(() => ROOM_NAMES, []);

  const validateRoom = useCallback(() => {
    if (!selectedRoom) {
      return "Выберите комнату";
    }
    if (!isValidRoom(selectedRoom)) {
      return "Некорректная комната";
    }
    return null;
  }, [selectedRoom]);

  const saveRoom = useCallback(() => {
    if (selectedRoom && isValidRoom(selectedRoom)) {
      sessionStorage.setItem("currentRoom", selectedRoom);
    }
  }, [selectedRoom]);

  return {
    selectedRoom,
    setSelectedRoom,
    availableRooms,
    validateRoom,
    saveRoom,
  };
};
