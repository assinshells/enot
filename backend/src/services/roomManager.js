// backend/src/services/roomManager.js
import { ROOM_NAMES } from "../../../frontend/src/shared/config/rooms.js";

class RoomManager {
  constructor() {
    this.rooms = new Map();
    this.userRooms = new Map();
    this.validRooms = ROOM_NAMES; // ✅ Из конфига
  }

  /**
   * Присоединить пользователя к комнате
   */
  joinRoom(socket, userId, roomName) {
    if (!this.isValidRoom(roomName)) {
      throw new Error(`Комната "${roomName}" не существует`);
    }

    // Выход из текущей комнаты
    const currentRoom = this.userRooms.get(userId);
    if (currentRoom) {
      this.leaveRoom(socket, userId);
    }

    // Вход в новую комнату
    socket.join(roomName);

    if (!this.rooms.has(roomName)) {
      this.rooms.set(roomName, new Set());
    }
    this.rooms.get(roomName).add(socket.id);
    this.userRooms.set(userId, roomName);

    console.log(`✅ ${userId} joined ${roomName}`);
    return this.getRoomCounts();
  }

  /**
   * Выйти из комнаты
   */
  leaveRoom(socket, userId) {
    const roomName = this.userRooms.get(userId);
    if (!roomName) return null;

    socket.leave(roomName);

    const roomUsers = this.rooms.get(roomName);
    if (roomUsers) {
      roomUsers.delete(socket.id);
      if (roomUsers.size === 0) {
        this.rooms.delete(roomName);
      }
    }

    this.userRooms.delete(userId);
    console.log(`❌ ${userId} left ${roomName}`);

    return this.getRoomCounts();
  }

  /**
   * Получить текущую комнату пользователя
   */
  getUserRoom(userId) {
    return this.userRooms.get(userId);
  }

  /**
   * Получить количество пользователей в каждой комнате
   */
  getRoomCounts() {
    const counts = {};
    for (const roomName of this.validRooms) {
      counts[roomName] = this.rooms.get(roomName)?.size || 0;
    }
    return counts;
  }

  /**
   * Общее количество пользователей
   */
  getTotalUsers() {
    return this.userRooms.size;
  }

  /**
   * Проверка существования комнаты
   */
  isValidRoom(roomName) {
    return this.validRooms.includes(roomName);
  }

  /**
   * Получить список всех комнат
   */
  getAvailableRooms() {
    return this.validRooms.map((name) => ({
      name,
      count: this.rooms.get(name)?.size || 0,
    }));
  }
}

export default new RoomManager();
