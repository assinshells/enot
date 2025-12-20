/**
 * Chat Controller - Відрефакторений
 * Використовує messageService для бізнес-логіки
 */
import messageService from "../services/messageService.js";
import { sendMessageToRoom } from "../services/socketService.js";
import roomManager from "../services/roomManager.js";
import logger from "../config/logger.js";

export const getMessages = async (req, res, next) => {
  try {
    const { room } = req.query;

    if (!room || !roomManager.isValidRoom(room)) {
      return res.status(400).json({
        success: false,
        message: "Укажите корректную комнату",
      });
    }

    const messages = await messageService.getRoomMessages(room);

    logger.info(`Получено ${messages.length} сообщений для комнаты "${room}"`);

    res.json({
      success: true,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

export const createMessage = async (req, res, next) => {
  try {
    const { text, room, recipient } = req.body;

    // Валідація
    const validationErrors = messageService.validateMessageData(text, room);
    if (validationErrors) {
      return res.status(400).json({
        success: false,
        message: validationErrors[0],
        errors: validationErrors,
      });
    }

    // Перевірка кімнати
    if (!roomManager.isValidRoom(room)) {
      return res.status(400).json({
        success: false,
        message: "Укажите корректную комнату",
      });
    }

    // Перевірка, чи користувач в цій кімнаті
    const userRoom = roomManager.getUserRoom(req.user._id.toString());
    if (userRoom !== room) {
      return res.status(403).json({
        success: false,
        message: "Вы не находитесь в этой комнате",
      });
    }

    // Створення повідомлення
    const message = await messageService.createUserMessage({
      user: req.user,
      text,
      room,
      recipient,
    });

    // Відправка через Socket.IO
    sendMessageToRoom(room, "message:new", {
      _id: message._id,
      user: message.user,
      nickname: message.nickname,
      userColor: message.userColor,
      room: message.room,
      text: message.text,
      recipient: message.recipient || null,
      createdAt: message.createdAt,
    });

    return res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
};
