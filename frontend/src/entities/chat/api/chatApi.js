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
   * @param {string|null} recipient - Получатель (опционально)
   */
  sendMessage: async (text, room, recipient = null) => {
    const data = { text, room };

    if (recipient && recipient.trim()) {
      data.recipient = recipient.trim();
    }

    return request.post("/chat/messages", data);
  },
};
