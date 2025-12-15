import User from "../models/userModel.js";
import logger from "../config/logger.js";

/**
 * @desc    Получить профиль текущего пользователя
 * @route   GET /api/users/profile
 * @access  Private
 */
export const getProfile = async (req, res, next) => {
  try {
    const user = {
      _id: req.user._id,
      nickname: req.user.nickname,
      email: req.user.email,
      color: req.user.color,
      createdAt: req.user.createdAt,
    };

    logger.info(`Профиль запрошен: ${req.user.nickname}`);

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Обновить профиль пользователя
 * @route   PUT /api/users/profile
 * @access  Private
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { color } = req.body;

    if (color && !["black", "blue", "green", "orange"].includes(color)) {
      return res.status(400).json({
        success: false,
        message: "Недопустимый цвет",
      });
    }

    const user = await User.findById(req.user._id);

    if (color) {
      user.color = color;
    }

    await user.save();

    logger.info(`Профиль обновлен: ${user.nickname}`);

    res.json({
      success: true,
      data: {
        _id: user._id,
        nickname: user.nickname,
        email: user.email,
        color: user.color,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};
