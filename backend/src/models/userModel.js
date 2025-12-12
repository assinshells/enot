import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * Схема пользователя
 * - nickname: уникальный никнейм (обязательное поле)
 * - email: опциональный email
 * - password: хешированный пароль (обязательное поле)
 * - resetPasswordToken: токен для восстановления пароля
 * - resetPasswordExpire: время истечения токена
 */
const userSchema = new mongoose.Schema({
  nickname: {
    type: String,
    required: [true, 'Никнейм обязателен'],
    unique: true,
    trim: true,
    minlength: [3, 'Никнейм должен быть минимум 3 символа'],
    maxlength: [30, 'Никнейм не должен превышать 30 символов']
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Введите корректный email']
  },
  password: {
    type: String,
    required: [true, 'Пароль обязателен'],
    minlength: [6, 'Пароль должен быть минимум 6 символов'],
    select: false // Не возвращать пароль по умолчанию
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, {
  timestamps: true // createdAt, updatedAt
});

// Хеширование пароля перед сохранением
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Метод для проверки пароля
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;