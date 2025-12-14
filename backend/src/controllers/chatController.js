import Message from "../models/messageModel.js";
import { sendMessageToRoom } from "../services/socketService.js";
import roomManager from "../services/roomManager.js";
import logger from "../config/logger.js";

/**
 * Получить сообщения комнаты
 * @route GET /api/chat/messages?room=Главная
 */
export const getMessages = async (req, res, next) => {
  try {
    const { room } = req.query;

    // ✅ Валидация комнаты
    if (!room || !roomManager.isValidRoom(room)) {
      return res.status(400).json({
        success: false,
        message: "Укажите корректную комнату",
      });
    }

    // ✅ Фильтруем по комнате
    const messages = await Message.find({ room })
      .sort({ createdAt: -1 })
      .limit(50) // Последние 50 сообщений
      .lean()
      .select("-__v");

    const orderedMessages = messages.reverse();

    logger.info(
      `Получено ${orderedMessages.length} сообщений для комнаты "${room}"`
    );

    res.json({
      success: true,
      data: orderedMessages,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Создать сообщение в комнате
 * @route POST /api/chat/messages
 */
export const createMessage = async (req, res, next) => {
  try {
    const { text, room } = req.body;

    // ✅ Валидация
    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Текст сообщения обязателен",
      });
    }

    if (text.trim().length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Сообщение слишком длинное (макс. 1000 символов)",
      });
    }

    if (!room || !roomManager.isValidRoom(room)) {
      return res.status(400).json({
        success: false,
        message: "Укажите корректную комнату",
      });
    }

    // ✅ Проверяем, что пользователь в этой комнате
    const userRoom = roomManager.getUserRoom(req.user._id.toString());
    if (userRoom !== room) {
      return res.status(403).json({
        success: false,
        message: "Вы не находитесь в этой комнате",
      });
    }

    // ✅ Создаём сообщение
    const message = await Message.create({
      user: req.user._id,
      nickname: req.user.nickname,
      room,
      text: text.trim(),
    });

    logger.info(`Сообщение создано: ${message._id} в комнате "${room}"`);

    // ✅ Отправляем ТОЛЬКО в эту комнату
    sendMessageToRoom(room, "message:new", {
      _id: message._id,
      user: message.user,
      nickname: message.nickname,
      room: message.room,
      text: message.text,
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
