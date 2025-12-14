/**
 * Controller: Chat
 * Путь: backend/src/controllers/chatController.js
 */
import Message from "../models/messageModel.js";
import logger from "../config/logger.js";

/**
 * @desc    Получить последние 100 сообщений
 * @route   GET /api/chat/messages
 * @access  Private
 */
export const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    // Реверсируем для правильного порядка (старые -> новые)
    const orderedMessages = messages.reverse();

    logger.info(`Получено ${orderedMessages.length} сообщений`);

    res.json({
      success: true,
      data: orderedMessages,
    });
    // Отправка через Socket.IO всем подключенным
    const io = await import("../services/socketService.js").then((m) =>
      m.getIO()
    );
    io.emit("message:new", message);

    return res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Создать сообщение
 * @route   POST /api/chat/messages
 * @access  Private
 */
export const createMessage = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Текст сообщения обязателен",
      });
    }

    const message = await Message.create({
      user: req.user._id,
      nickname: req.user.nickname,
      text: text.trim(),
    });

    logger.info(`Сообщение создано: ${message._id} от ${req.user.nickname}`);

    // Отправка через Socket.IO всем подключенным
    const io = await import("../services/socketService.js").then((m) =>
      m.getIO()
    );
    io.emit("message:new", message);

    return res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
};
