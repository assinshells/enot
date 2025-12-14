/**
 * Routes: Chat
 * Путь: backend/src/routes/chatRoutes.js
 */
import express from "express";
import { getMessages, createMessage } from "../controllers/chatController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Все маршруты защищены
router.use(protect);

// Получить сообщения
router.get("/messages", getMessages);

// Создать сообщение
router.post("/messages", createMessage);

export default router;
