import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import { generateResetToken, hashResetToken } from '../utils/passwordHash.js';
import mailService from '../services/mailService.js';
import logger from '../config/logger.js';

/**
 * @desc    Регистрация пользователя
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    const { nickname, email, password } = req.body;

    // Проверка существования пользователя
    const userExists = await User.findOne({
      $or: [
        { nickname },
        ...(email ? [{ email }] : [])
      ]
    });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Пользователь с таким никнеймом или email уже существует'
      });
    }

    // Создание пользователя
    const user = await User.create({
      nickname,
      email: email || undefined,
      password
    });

    logger.info(`Новый пользователь зарегистрирован: ${nickname}`);

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        nickname: user.nickname,
        email: user.email,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Авторизация пользователя
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { login, password } = req.body;

    // Поиск пользователя по никнейму или email
    const user = await User.findOne({
      $or: [
        { nickname: login },
        { email: login }
      ]
    }).select('+password');

    if (!user) {
      logger.warn(`Неудачная попытка входа: ${login}`);
      return res.status(401).json({
        success: false,
        message: 'Неверный логин или пароль'
      });
    }

    // Проверка пароля
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      logger.warn(`Неверный пароль для пользователя: ${login}`);
      return res.status(401).json({
        success: false,
        message: 'Неверный логин или пароль'
      });
    }

    logger.info(`Пользователь вошел в систему: ${user.nickname}`);

    res.json({
      success: true,
      data: {
        _id: user._id,
        nickname: user.nickname,
        email: user.email,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Запрос на восстановление пароля
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Пользователь с таким email не найден'
      });
    }

    // Генерация токена сброса
    const resetToken = generateResetToken();
    const hashedToken = hashResetToken(resetToken);

    // Сохранение токена и времени истечения (10 минут)
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 минут
    await user.save();

    // URL для сброса пароля
    const resetUrl = `${process.env.CORS_ORIGIN}/reset-password/${resetToken}`;

    // Отправка email (в DEV логируется в консоль)
    await mailService.sendPasswordReset(email, resetUrl);

    logger.info(`Запрос восстановления пароля для: ${email}`);

    res.json({
      success: true,
      message: 'Письмо для восстановления пароля отправлено'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Сброс пароля по токену
 * @route   POST /api/auth/reset-password/:token
 * @access  Public
 */
export const resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const hashedToken = hashResetToken(req.params.token);

    // Поиск пользователя с валидным токеном
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Недействительный или истекший токен'
      });
    }

    // Установка нового пароля
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    logger.info(`Пароль сброшен для пользователя: ${user.nickname}`);

    res.json({
      success: true,
      message: 'Пароль успешно изменен',
      data: {
        _id: user._id,
        nickname: user.nickname,
        email: user.email,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    next(error);
  }
};