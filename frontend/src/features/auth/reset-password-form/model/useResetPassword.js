/**
 * Feature: Reset Password Hook (ИСПРАВЛЕНО)
 * Путь: src/features/auth/reset-password-form/model/useResetPassword.js
 */
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authApi } from "@/entities/user";
import { tokenLib } from "@/shared/lib/token/token";
import { useAuth } from "@/shared/lib/hooks/useAuth";

export const useResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { setUser } = useAuth(); // ✅ Получаем setUser из контекста

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Валидация
    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    if (password.length < 6) {
      setError("Пароль должен быть минимум 6 символов");
      return;
    }

    setLoading(true);

    try {
      const response = await authApi.resetPassword(token, password);

      // Сохраняем токен и данные пользователя
      const { token: authToken, ...userData } = response.data;
      tokenLib.set(authToken);
      setUser(userData);

      navigate("/");
    } catch (err) {
      setError(err.message || "Ошибка при сбросе пароля");
    } finally {
      setLoading(false);
    }
  };

  return {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    loading,
    handleSubmit,
  };
};
