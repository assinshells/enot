/**
 * Feature: Forgot Password Hook
 * Путь: src/features/auth/forgot-password-form/model/useForgotPassword.js
 */
import { useState } from "react";
import { authApi } from "@/entities/user";

export const useForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await authApi.forgotPassword(email);
      setMessage("Письмо для восстановления пароля отправлено на ваш email");
      setEmail("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    message,
    error,
    loading,
    handleSubmit,
  };
};
