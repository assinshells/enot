/**
 * Shared Hook: Room Users Management
 * Путь: src/shared/lib/hooks/useRoomUsers.js
 */
import { useState, useCallback } from "react";
import { useSocketEvent } from "./useSocket";

export const useRoomUsers = () => {
  const [users, setUsers] = useState([]);

  useSocketEvent(
    "room:users",
    useCallback((data) => {
      setUsers(data);
    }, [])
  );

  return users;
};
