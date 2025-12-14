import Joi from "joi";

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(400).json({
        success: false,
        errors,
      });
    }

    next();
  };
};

export const registerSchema = Joi.object({
  nickname: Joi.string().min(3).max(30).required().messages({
    "string.min": "Никнейм должен быть минимум 3 символа",
    "string.max": "Никнейм не должен превышать 30 символов",
    "any.required": "Никнейм обязателен",
  }),
  email: Joi.string().email().optional().allow("").messages({
    "string.email": "Введите корректный email",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Пароль должен быть минимум 6 символов",
    "any.required": "Пароль обязателен",
  }),
});

export const loginSchema = Joi.object({
  login: Joi.string().required().messages({
    "any.required": "Никнейм или email обязателен",
  }),
  password: Joi.string().required().messages({
    "any.required": "Пароль обязателен",
  }),
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Введите корректный email",
    "any.required": "Email обязателен",
  }),
});

export const resetPasswordSchema = Joi.object({
  password: Joi.string().min(6).required().messages({
    "string.min": "Пароль должен быть минимум 6 символов",
    "any.required": "Пароль обязателен",
  }),
});

export default validate;
