/**
 * Routes: Chat
 * Путь: backend/src/routes/chatRoutes.js
 */
import express from "express";
import { getMessages, createMessage } from "../controllers/chatController.js";
import { protect } from "../middleware/authMiddleware.js";
import { messageRateLimit } from "../middleware/rateLimiter.js";

const router = express.Router();

// Все маршруты защищены
router.use(protect);

// Получить сообщения
router.get("/messages", getMessages);

// Создать сообщение
router.post("/messages", messageRateLimit, createMessage);

export default router;
