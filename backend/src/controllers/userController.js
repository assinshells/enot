import logger from '../config/logger.js';

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
      createdAt: req.user.createdAt
    };

    logger.info(`Профиль запрошен: ${req.user.nickname}`);

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};