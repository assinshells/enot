import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import { generateResetToken, hashResetToken } from "../utils/passwordHash.js";
import mailService from "../services/mailService.js";
import logger from "../config/logger.js";

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

export const register = async (req, res, next) => {
  try {
    const { nickname, email, password, color, gender, captchaToken } = req.body;

    if (process.env.NODE_ENV === "production" && !captchaToken) {
      return res.status(400).json({
        success: false,
        message: "Требуется пройти проверку капчи",
      });
    }

    const userExists = await User.findOne({ nickname });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "Пользователь с таким никнеймом уже существует",
      });
    }

    const userData = {
      nickname,
      password,
      color: color || "black",
      gender: gender || "unknown",
    };

    if (email && email.trim()) {
      userData.email = email.trim();
    }

    const user = await User.create(userData);

    logger.info(`Новый пользователь зарегистрирован: ${nickname}`);

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        nickname: user.nickname,
        email: user.email,
        color: user.color,
        gender: user.gender,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { nickname, password } = req.body;

    const user = await User.findOne({ nickname }).select("+password");

    if (!user) {
      logger.warn(`Пользователь не найден: ${nickname}`);
      return res.status(404).json({
        success: false,
        message: "user_not_found",
      });
    }

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
        gender: user.gender,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    next(error);
  }
};

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

    const resetToken = generateResetToken();
    const hashedToken = hashResetToken(resetToken);

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    const resetUrl = `${process.env.CORS_ORIGIN}/reset-password/${resetToken}`;

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

export const resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const hashedToken = hashResetToken(req.params.token);

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
