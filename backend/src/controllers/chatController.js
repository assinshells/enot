import Message from "../models/messageModel.js";
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

    const messages = await Message.find({ room })
      .sort({ createdAt: -1 })
      .limit(50)
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

export const createMessage = async (req, res, next) => {
  try {
    const { text, room } = req.body;

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

    const userRoom = roomManager.getUserRoom(req.user._id.toString());
    if (userRoom !== room) {
      return res.status(403).json({
        success: false,
        message: "Вы не находитесь в этой комнате",
      });
    }

    const message = await Message.create({
      user: req.user._id,
      nickname: req.user.nickname,
      userColor: req.user.color || "black",
      room,
      text: text.trim(),
    });

    logger.info(`Сообщение создано: ${message._id} в комнате "${room}"`);

    sendMessageToRoom(room, "message:new", {
      _id: message._id,
      user: message.user,
      nickname: message.nickname,
      userColor: message.userColor,
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
