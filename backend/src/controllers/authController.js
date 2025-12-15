import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import { generateResetToken, hashResetToken } from "../utils/passwordHash.js";
import mailService from "../services/mailService.js";
import logger from "../config/logger.js";

/**
 * @desc    Проверка существования пользователя
 * @route   POST /api/auth/check-user
 * @access  Public
 */
export const checkUser = async (req, res, next) => {
  try {
    const { nickname } = req.body;

    const user = await User.findOne({ nickname });

    res.json({
      success: true,
      exists: !!user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Регистрация нового пользователя (с email и капчей)
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    const { nickname, email, password, captchaToken } = req.body;

    // В production проверяем капчу
    if (process.env.NODE_ENV === "production") {
      // TODO: Добавить проверку капчи с внешним сервисом
      // Например, с Google reCAPTCHA или hCaptcha
      if (!captchaToken) {
        return res.status(400).json({
          success: false,
          message: "Требуется пройти проверку капчи",
        });
      }
    }

    // Проверка существования пользователя
    const userExists = await User.findOne({ nickname });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "Пользователь с таким никнеймом уже существует",
      });
    }

    // Создание пользователя
    const user = await User.create({
      nickname,
      email: email || undefined,
      password,
      isNewUser: true,
    });

    logger.info(`Новый пользователь зарегистрирован: ${nickname}`);

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        nickname: user.nickname,
        email: user.email,
        color: user.color,
        isNewUser: user.isNewUser,
        token: generateToken(user._id),
      },
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
    const { nickname, password } = req.body;

    // Поиск пользователя по никнейму
    const user = await User.findOne({ nickname }).select("+password");

    if (!user) {
      logger.warn(`Пользователь не найден: ${nickname}`);
      return res.status(404).json({
        success: false,
        message: "user_not_found",
      });
    }

    // Проверка пароля
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      logger.warn(`Неверный пароль для пользователя: ${nickname}`);
      return res.status(401).json({
        success: false,
        message: "Неверный пароль",
      });
    }

    logger.info(`Пользователь вошел в систему: ${user.nickname}`);

    res.json({
      success: true,
      data: {
        _id: user._id,
        nickname: user.nickname,
        email: user.email,
        color: user.color,
        isNewUser: user.isNewUser,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Установить флаг isNewUser в false
 * @route   POST /api/auth/mark-user-seen
 * @access  Private
 */
export const markUserSeen = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user.isNewUser) {
      user.isNewUser = false;
      await user.save();
    }

    res.json({
      success: true,
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
        message: "Пользователь с таким email не найден",
      });
    }

    // Генерация токена сброса
    const resetToken = generateResetToken();
    const hashedToken = hashResetToken(resetToken);

    // Сохранение токена и времени истечения (10 минут)
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    // URL для сброса пароля
    const resetUrl = `${process.env.CORS_ORIGIN}/reset-password/${resetToken}`;

    // Отправка email
    await mailService.sendPasswordReset(email, resetUrl);

    logger.info(`Запрос восстановления пароля для: ${email}`);

    res.json({
      success: true,
      message: "Письмо для восстановления пароля отправлено",
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
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Недействительный или истекший токен",
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
      message: "Пароль успешно изменен",
      data: {
        _id: user._id,
        nickname: user.nickname,
        email: user.email,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    next(error);
  }
};
