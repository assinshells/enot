/**
 * Entity: Chat API
 * Путь: src/entities/chat/api/chatApi.js
 */
import { request } from "@/shared/api/request";

export const chatApi = {
  /**
   * Получить последние сообщения комнаты
   * @param {string} room - Название комнаты
   * @param {object} options - Axios options (signal для отмены)
   */
  getMessages: async (room, options = {}) => {
    return request.get("/chat/messages", {
      params: { room },
      ...options,
    });
  },

  /**
   * Отправить сообщение в комнату
   * @param {string} text - Текст сообщения
   * @param {string} room - Название комнаты
   */
  sendMessage: async (text, room) => {
    return request.post("/chat/messages", { text, room });
  },
};
