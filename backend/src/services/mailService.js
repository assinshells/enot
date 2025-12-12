import nodemailer from 'nodemailer';
import logger from '../config/logger.js';

/**
 * Сервис отправки email
 * В режиме development письма не отправляются, а логируются в консоль
 */
class MailService {
  constructor() {
    // Проверяем NODE_ENV
    const nodeEnv = process.env.NODE_ENV;
    this.isDevelopment = nodeEnv === 'development' || !nodeEnv;
    
    // Детальное логирование режима
    logger.info('='.repeat(60));
    logger.info('📧 MailService Configuration');
    logger.info(`NODE_ENV: ${nodeEnv || 'undefined (defaulting to dev mode)'}`);
    logger.info(`Mode: ${this.isDevelopment ? 'DEVELOPMENT' : 'PRODUCTION'}`);
    logger.info(`Emails will be: ${this.isDevelopment ? 'LOGGED (not sent)' : 'SENT via SMTP'}`);
    logger.info('='.repeat(60));
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
      logger.info('='.repeat(60));
      logger.info('📧 EMAIL (DEV MODE) - Password Reset');
      logger.info('='.repeat(60));
      logger.info(`To: ${email}`);
      logger.info(`Subject: ${mailOptions.subject}`);
      logger.info(`Reset URL: ${resetUrl}`);
      logger.info('='.repeat(60));
      
      // Дополнительно выводим в console.log для гарантии
      console.log('\n' + '='.repeat(60));
      console.log('📧 EMAIL (DEV MODE) - Password Reset');
      console.log('='.repeat(60));
      console.log(`To: ${email}`);
      console.log(`Reset URL: ${resetUrl}`);
      console.log('='.repeat(60) + '\n');
      
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
      logger.info(`✅ Email sent successfully to ${email}`);
    } catch (error) {
      logger.error(`❌ Failed to send email to ${email}: ${error.message}`);
      throw new Error('Не удалось отправить письмо');
    }
  }
}

export default new MailService();