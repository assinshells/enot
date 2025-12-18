import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["user", "system"],
      default: "user",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: function () {
        return this.type === "user";
      },
      index: true,
    },
    nickname: {
      type: String,
      required: function () {
        return this.type === "user";
      },
    },
    userColor: {
      type: String,
      enum: ["black", "blue", "green", "orange"],
      default: "black",
    },
    room: {
      type: String,
      required: true,
      enum: ["Главная", "Знакомства", "Беспредел"],
      index: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: [1000, "Сообщение не должно превышать 1000 символов"],
    },
    recipient: {
      type: String,
      default: null,
      trim: true,
    },
    systemData: {
      users: [
        {
          userId: mongoose.Schema.Types.ObjectId,
          nickname: String,
          color: String,
          gender: String,
        },
      ],
      targetRoom: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 86400,
      index: true,
    },
  },
  {
    timestamps: false,
  }
);

messageSchema.index({ room: 1, createdAt: -1 });
messageSchema.index({ user: 1, room: 1 });
messageSchema.index({ recipient: 1 });
messageSchema.index({ type: 1 });

const Message = mongoose.model("Message", messageSchema);

export default Message;
