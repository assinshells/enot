import nodemailer from 'nodemailer';
import logger from '../config/logger.js';

/**
 * Сервис отправки email
 * В режиме development письма не отправляются, а логируются в консоль
 */
class MailService {
  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  /**
   * Отправка письма для сброса пароля
   * @param {string} email - Email получателя
   * @param {string} resetUrl - URL для сброса пароля
   */
  async sendPasswordReset(email, resetUrl) {
    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@chatapp.com',
      to: email,
      subject: 'Восстановление пароля',
      html: `
        <h2>Вы запросили восстановление пароля</h2>
        <p>Перейдите по ссылке ниже для сброса пароля:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>Ссылка действительна 10 минут.</p>
        <p>Если вы не запрашивали восстановление пароля, проигнорируйте это письмо.</p>
      `
    };

    // В DEV режиме - логируем в консоль
    if (this.isDevelopment) {
      logger.info({
        msg: '📧 EMAIL (DEV MODE) - Письмо для восстановления пароля',
        to: email,
        resetUrl: resetUrl,
        subject: mailOptions.subject
      });
      return;
    }

    // В PROD - отправляем реальное письмо
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      await transporter.sendMail(mailOptions);
      logger.info(`Email отправлен на ${email}`);
    } catch (error) {
      logger.error(`Ошибка отправки email: ${error.message}`);
      throw new Error('Не удалось отправить письмо');
    }
  }
}

export default new MailService();