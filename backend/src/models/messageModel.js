/**
 * Model: Message
 * Путь: backend/src/models/messageModel.js
 */
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    nickname: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: [true, "Текст сообщения обязателен"],
      trim: true,
      maxlength: [1000, "Сообщение не должно превышать 1000 символов"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 86400, // 24 часа в секундах (TTL index)
    },
  },
  {
    timestamps: false, // Отключаем updatedAt, используем только createdAt
  }
);

// Индексы для оптимизации
messageSchema.index({ createdAt: -1 });

const Message = mongoose.model("Message", messageSchema);

export default Message;
