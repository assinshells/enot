/**
 * Controller: Chat
 * Путь: backend/src/controllers/chatController.js
 */
import Message from "../models/messageModel.js";
import logger from "../config/logger.js";

export const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .lean()
      .select("-__v"); // Оптимизация: не возвращаем __v

    const orderedMessages = messages.reverse();

    logger.info(`Получено ${orderedMessages.length} сообщений`);

    res.json({
      success: true,
      data: orderedMessages,
    });
  } catch (error) {
    next(error);
  }
};

export const createMessage = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Текст сообщения обязателен",
      });
    }

    // Проверка длины
    if (text.trim().length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Сообщение слишком длинное (макс. 1000 символов)",
      });
    }

    const message = await Message.create({
      user: req.user._id,
      nickname: req.user.nickname,
      text: text.trim(),
    });

    logger.info(`Сообщение создано: ${message._id} от ${req.user.nickname}`);

    // Отправка через Socket.IO
    const io = await import("../services/socketService.js").then((m) =>
      m.getIO()
    );

    // ✅ Отправляем только необходимые данные
    io.emit("message:new", {
      _id: message._id,
      user: message.user,
      nickname: message.nickname,
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
