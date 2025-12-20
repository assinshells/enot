/**
 * Message Service - Бізнес-логіка повідомлень
 * Винесено з socketService для кращої організації
 */
import Message from "../models/messageModel.js";
import { SYSTEM_MESSAGE_TYPES, MESSAGE_TYPES } from "../shared/constants.js";
import { formatSystemMessage } from "../utils/systemMessageFormatter.js";
import logger from "../config/logger.js";

class MessageService {
  /**
   * Створити системне повідомлення
   */
  async createSystemMessage(type, users, room, targetRoom = null) {
    if (!users || users.length === 0) {
      logger.warn("Attempted to create system message with no users");
      return null;
    }

    const text = formatSystemMessage(type, users, targetRoom);
    if (!text) {
      logger.warn("Failed to format system message", {
        type,
        users,
        targetRoom,
      });
      return null;
    }

    try {
      const systemData = {
        users: users.map((u) => ({
          userId: u._id,
          nickname: u.nickname,
          color: u.color,
          gender: u.gender,
        })),
      };

      if (targetRoom) {
        systemData.targetRoom = targetRoom;
      }

      const message = await Message.create({
        type: MESSAGE_TYPES.SYSTEM,
        room,
        text,
        systemData,
      });

      return message;
    } catch (error) {
      logger.error("Error creating system message:", error);
      throw error;
    }
  }

  /**
   * Отримати повідомлення кімнати
   */
  async getRoomMessages(room, limit = 50) {
    try {
      const messages = await Message.find({ room })
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean()
        .select("-__v");

      return messages.reverse();
    } catch (error) {
      logger.error("Error fetching room messages:", error);
      throw error;
    }
  }

  /**
   * Створити користувацьке повідомлення
   */
  async createUserMessage(data) {
    const { user, text, room, recipient = null } = data;

    try {
      const messageData = {
        type: MESSAGE_TYPES.USER,
        user: user._id,
        nickname: user.nickname,
        userColor: user.color || "black",
        room,
        text: text.trim(),
      };

      if (recipient && recipient.trim()) {
        messageData.recipient = recipient.trim();
      }

      const message = await Message.create(messageData);

      logger.info(
        `Message created: ${message._id} in room "${room}"${
          message.recipient ? ` for ${message.recipient}` : ""
        }`
      );

      return message;
    } catch (error) {
      logger.error("Error creating user message:", error);
      throw error;
    }
  }

  /**
   * Валідувати дані повідомлення
   */
  validateMessageData(text, room) {
    const errors = [];

    if (!text || !text.trim()) {
      errors.push("Текст сообщения обязателен");
    }

    if (text && text.trim().length > 1000) {
      errors.push("Сообщение слишком длинное (макс. 1000 символов)");
    }

    if (!room) {
      errors.push("Комната не указана");
    }

    return errors.length > 0 ? errors : null;
  }
}

export default new MessageService();
