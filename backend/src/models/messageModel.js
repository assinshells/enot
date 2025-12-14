import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // ✅ Индекс для быстрого поиска
    },
    nickname: {
      type: String,
      required: true,
    },
    room: {
      type: String,
      required: true,
      enum: ["Главная", "Знакомства", "Беспредел"], // ✅ Валидация
      index: true, // ✅ Индекс для фильтрации по комнате
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
      expires: 86400, // TTL: 24 часа
      index: true, // ✅ Индекс для сортировки
    },
  },
  {
    timestamps: false,
  }
);

// ✅ Составной индекс для оптимизации запросов
messageSchema.index({ room: 1, createdAt: -1 });

const Message = mongoose.model("Message", messageSchema);

export default Message;
