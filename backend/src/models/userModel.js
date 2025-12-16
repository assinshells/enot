import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    nickname: {
      type: String,
      required: [true, "Никнейм обязателен"],
      unique: true,
      trim: true,
      minlength: [3, "Никнейм должен быть минимум 3 символа"],
      maxlength: [30, "Никнейм не должен превышать 30 символов"],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true,
      match: [/^\S+@\S+\.\S+$/, "Введите корректный email"],
    },
    password: {
      type: String,
      required: [true, "Пароль обязателен"],
      minlength: [6, "Пароль должен быть минимум 6 символов"],
      select: false,
    },
    color: {
      type: String,
      enum: ["black", "blue", "green", "orange"],
      default: "black",
    },
    isNewUser: {
      type: Boolean,
      default: true,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.index({ email: 1 }, { sparse: true });

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
