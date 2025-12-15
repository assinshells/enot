/**
 * Shared Hook: Room Form Logic
 * Путь: src/shared/lib/hooks/useRoomForm.js
 */
import { useState } from "react";
import { ROOM_NAMES, DEFAULT_ROOM, isValidRoom } from "@/shared/config/rooms";

export const useRoomForm = (initialRoom = DEFAULT_ROOM) => {
  const [selectedRoom, setSelectedRoom] = useState(initialRoom);

  const validateRoom = () => {
    if (!selectedRoom || !isValidRoom(selectedRoom)) {
      return "Выберите корректную комнату";
    }
    return null;
  };

  const saveToSession = () => {
    if (selectedRoom && isValidRoom(selectedRoom)) {
      sessionStorage.setItem("initialRoom", selectedRoom);
    }
  };

  return {
    selectedRoom,
    setSelectedRoom,
    availableRooms: ROOM_NAMES,
    validateRoom,
    saveToSession,
  };
};
