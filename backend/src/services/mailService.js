import nodemailer from "nodemailer";
import logger from "../config/logger.js";

class MailService {
  constructor() {
    this.isDevelopment =
      process.env.NODE_ENV === "development" || !process.env.NODE_ENV;

    logger.info(
      `📧 MailService initialized in ${
        this.isDevelopment ? "DEVELOPMENT" : "PRODUCTION"
      } mode`
    );
  }

  async sendPasswordReset(email, resetUrl) {
    const mailOptions = {
      from: process.env.SMTP_FROM || "noreply@chatapp.com",
      to: email,
      subject: "Восстановление пароля",
      html: `
        <h2>Вы запросили восстановление пароля</h2>
        <p>Перейдите по ссылке ниже для сброса пароля:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>Ссылка действительна 10 минут.</p>
        <p>Если вы не запрашивали восстановление пароля, проигнорируйте это письмо.</p>
      `,
    };

    if (this.isDevelopment) {
      logger.info("📧 EMAIL (DEV MODE) - Password Reset", {
        to: email,
        resetUrl,
      });
      return;
    }

    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail(mailOptions);
      logger.info(`✅ Email sent successfully to ${email}`);
    } catch (error) {
      logger.error(`❌ Failed to send email to ${email}: ${error.message}`);
      throw new Error("Не удалось отправить письмо");
    }
  }
}

export default new MailService();
