/**
 * DEPRECATED: Use roomUtils instead
 * Путь: src/shared/lib/hooks/useRoomStorage.js
 */
import { roomUtils } from "@/shared/lib/utils/roomUtils";

export const useRoomStorage = () => {
  console.warn(
    "useRoomStorage is deprecated. Use roomUtils from @/shared/lib/utils/roomUtils instead"
  );

  return {
    initialRoom: roomUtils.getInitialRoom(),
    saveRoom: roomUtils.saveRoom,
  };
};
