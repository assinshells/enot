/**
 * Shared Utils: Room Utilities
 * Путь: src/shared/lib/utils/roomUtils.js
 */
import { DEFAULT_ROOM, isValidRoom } from "@/shared/config/rooms";

const STORAGE_KEY = "initialRoom";

export const roomUtils = {
  getInitialRoom: () => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored && isValidRoom(stored) ? stored : DEFAULT_ROOM;
  },

  saveRoom: (room) => {
    if (isValidRoom(room)) {
      sessionStorage.setItem(STORAGE_KEY, room);
    }
  },

  clearRoom: () => {
    sessionStorage.removeItem(STORAGE_KEY);
  },
};
