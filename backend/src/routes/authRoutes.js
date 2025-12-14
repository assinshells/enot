import express from "express";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import validate, {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../middleware/validateMiddleware.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post(
  "/reset-password/:token",
  validate(resetPasswordSchema),
  resetPassword
);

export default router;
