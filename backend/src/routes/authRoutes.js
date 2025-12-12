import express from 'express';
import {
  register,
  login,
  forgotPassword,
  resetPassword
} from '../controllers/authController.js';
import validate, {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} from '../middleware/validateMiddleware.js';

const router = express.Router();

// Регистрация
router.post('/register', validate(registerSchema), register);

// Авторизация
router.post('/login', validate(loginSchema), login);

// Запрос восстановления пароля
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);

// Сброс пароля
router.post('/reset-password/:token', validate(resetPasswordSchema), resetPassword);

export default router;