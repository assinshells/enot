/**
 * Feature: Reset Password Hook
 * Путь: src/features/auth/reset-password-form/model/useResetPassword.js
 */
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authApi } from "@/entities/user";
import { tokenLib } from "@/shared/lib/token/token";

export const useResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

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
      tokenLib.set(response.token);
      navigate("/");
    } catch (err) {
      setError(err.message);
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
