/**
 * Entity: Chat API
 * Путь: src/entities/chat/api/chatApi.js
 */
import { request } from "@/shared/api/request";

export const chatApi = {
  // Получить последние сообщения
  getMessages: async () => {
    return request.get("/chat/messages");
  },

  // Отправить сообщение
  sendMessage: async (text) => {
    return request.post("/chat/messages", { text });
  },
};
