/**
 * Validation Service - Централізована валідація
 * Використовується для валідації даних на рівні сервісів
 */
import {
  COLOR_LIST,
  GENDER_LIST,
  ROOM_NAMES,
  VALIDATION,
} from "../shared/constants.js";

class ValidationService {
  /**
   * Валідація нікнейму
   */
  validateNickname(nickname) {
    const errors = [];

    if (!nickname || typeof nickname !== "string") {
      errors.push("Nickname is required");
      return errors;
    }

    const trimmed = nickname.trim();

    if (trimmed.length < VALIDATION.NICKNAME_MIN_LENGTH) {
      errors.push(
        `Nickname must be at least ${VALIDATION.NICKNAME_MIN_LENGTH} characters`
      );
    }

    if (trimmed.length > VALIDATION.NICKNAME_MAX_LENGTH) {
      errors.push(
        `Nickname must not exceed ${VALIDATION.NICKNAME_MAX_LENGTH} characters`
      );
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
      errors.push(
        "Nickname can only contain letters, numbers, underscores and hyphens"
      );
    }

    return errors;
  }

  /**
   * Валідація email
   */
  validateEmail(email) {
    const errors = [];

    if (!email) {
      return errors; // Email опціональний
    }

    if (typeof email !== "string") {
      errors.push("Email must be a string");
      return errors;
    }

    const trimmed = email.trim();

    if (!VALIDATION.EMAIL_REGEX.test(trimmed)) {
      errors.push("Invalid email format");
    }

    return errors;
  }

  /**
   * Валідація пароля
   */
  validatePassword(password) {
    const errors = [];

    if (!password || typeof password !== "string") {
      errors.push("Password is required");
      return errors;
    }

    if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
      errors.push(
        `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`
      );
    }

    if (password.length > 128) {
      errors.push("Password is too long (max 128 characters)");
    }

    return errors;
  }

  /**
   * Валідація кольору
   */
  validateColor(color) {
    const errors = [];

    if (!color) {
      return errors; // Колір опціональний (є default)
    }

    if (typeof color !== "string") {
      errors.push("Color must be a string");
      return errors;
    }

    if (!COLOR_LIST.includes(color)) {
      errors.push(`Invalid color. Allowed values: ${COLOR_LIST.join(", ")}`);
    }

    return errors;
  }

  /**
   * Валідація статі
   */
  validateGender(gender) {
    const errors = [];

    if (!gender) {
      return errors; // Стать опціональна (є default)
    }

    if (typeof gender !== "string") {
      errors.push("Gender must be a string");
      return errors;
    }

    if (!GENDER_LIST.includes(gender)) {
      errors.push(`Invalid gender. Allowed values: ${GENDER_LIST.join(", ")}`);
    }

    return errors;
  }

  /**
   * Валідація кімнати
   */
  validateRoom(room) {
    const errors = [];

    if (!room || typeof room !== "string") {
      errors.push("Room is required");
      return errors;
    }

    if (!ROOM_NAMES.includes(room)) {
      errors.push(`Invalid room. Allowed values: ${ROOM_NAMES.join(", ")}`);
    }

    return errors;
  }

  /**
   * Валідація тексту повідомлення
   */
  validateMessageText(text) {
    const errors = [];

    if (!text || typeof text !== "string") {
      errors.push("Message text is required");
      return errors;
    }

    const trimmed = text.trim();

    if (trimmed.length === 0) {
      errors.push("Message cannot be empty");
    }

    if (trimmed.length > VALIDATION.MESSAGE_MAX_LENGTH) {
      errors.push(
        `Message is too long (max ${VALIDATION.MESSAGE_MAX_LENGTH} characters)`
      );
    }

    return errors;
  }

  /**
   * Валідація отримувача повідомлення
   */
  validateRecipient(recipient) {
    const errors = [];

    if (!recipient) {
      return errors; // Отримувач опціональний
    }

    if (typeof recipient !== "string") {
      errors.push("Recipient must be a string");
      return errors;
    }

    const trimmed = recipient.trim();

    if (trimmed.length < VALIDATION.NICKNAME_MIN_LENGTH) {
      errors.push(
        `Recipient nickname must be at least ${VALIDATION.NICKNAME_MIN_LENGTH} characters`
      );
    }

    if (trimmed.length > VALIDATION.NICKNAME_MAX_LENGTH) {
      errors.push(
        `Recipient nickname must not exceed ${VALIDATION.NICKNAME_MAX_LENGTH} characters`
      );
    }

    return errors;
  }

  /**
   * Валідація даних реєстрації
   */
  validateRegistrationData(data) {
    const allErrors = {};

    // Валідуємо кожне поле
    const nicknameErrors = this.validateNickname(data.nickname);
    if (nicknameErrors.length > 0) {
      allErrors.nickname = nicknameErrors;
    }

    const emailErrors = this.validateEmail(data.email);
    if (emailErrors.length > 0) {
      allErrors.email = emailErrors;
    }

    const passwordErrors = this.validatePassword(data.password);
    if (passwordErrors.length > 0) {
      allErrors.password = passwordErrors;
    }

    const colorErrors = this.validateColor(data.color);
    if (colorErrors.length > 0) {
      allErrors.color = colorErrors;
    }

    const genderErrors = this.validateGender(data.gender);
    if (genderErrors.length > 0) {
      allErrors.gender = genderErrors;
    }

    return allErrors;
  }

  /**
   * Валідація даних повідомлення
   */
  validateMessageData(data) {
    const allErrors = {};

    const textErrors = this.validateMessageText(data.text);
    if (textErrors.length > 0) {
      allErrors.text = textErrors;
    }

    const roomErrors = this.validateRoom(data.room);
    if (roomErrors.length > 0) {
      allErrors.room = roomErrors;
    }

    const recipientErrors = this.validateRecipient(data.recipient);
    if (recipientErrors.length > 0) {
      allErrors.recipient = recipientErrors;
    }

    return allErrors;
  }

  /**
   * Перевірка чи є помилки валідації
   */
  hasErrors(errors) {
    return Object.keys(errors).length > 0;
  }

  /**
   * Форматування помилок валідації для відповіді
   */
  formatErrors(errors) {
    const formatted = [];

    for (const [field, fieldErrors] of Object.entries(errors)) {
      formatted.push(...fieldErrors.map((err) => `${field}: ${err}`));
    }

    return formatted;
  }
}

export default new ValidationService();
