import express from 'express';
import { getProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Получить профиль пользователя (защищенный маршрут)
router.get('/profile', protect, getProfile);

export default router;