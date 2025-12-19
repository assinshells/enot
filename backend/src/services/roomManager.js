import { ROOM_NAMES, isValidRoom } from "../shared/constants.js";

class RoomManager {
  constructor() {
    this.rooms = new Map();
    this.userRooms = new Map();
    this.validRooms = ROOM_NAMES;
  }

  joinRoom(socket, userId, roomName) {
    if (!isValidRoom(roomName)) {
      throw new Error(`Комната "${roomName}" не существует`);
    }

    const currentRoom = this.userRooms.get(userId);
    if (currentRoom) {
      this.leaveRoom(socket, userId);
    }

    socket.join(roomName);

    if (!this.rooms.has(roomName)) {
      this.rooms.set(roomName, new Set());
    }
    this.rooms.get(roomName).add(socket.id);
    this.userRooms.set(userId, roomName);

    return this.getRoomCounts();
  }

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
    return this.getRoomCounts();
  }

  getUserRoom(userId) {
    return this.userRooms.get(userId);
  }

  getRoomCounts() {
    const counts = {};
    for (const roomName of this.validRooms) {
      counts[roomName] = this.rooms.get(roomName)?.size || 0;
    }
    return counts;
  }

  getTotalUsers() {
    return this.userRooms.size;
  }

  isValidRoom(roomName) {
    return isValidRoom(roomName);
  }

  getAvailableRooms() {
    return this.validRooms.map((name) => ({
      name,
      count: this.rooms.get(name)?.size || 0,
    }));
  }
}

export default new RoomManager();
