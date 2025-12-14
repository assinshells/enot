/**
 * Feature: Login Form Hook
 * Путь: src/features/auth/login-form/model/useLoginForm.js
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/shared/lib/hooks/useAuth";
import { ROOM_NAMES, DEFAULT_ROOM } from "@/shared/config/rooms";

const AVAILABLE_ROOMS = ["Главная", "Знакомства", "Беспредел"];

export const useLoginForm = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [formData, setFormData] = useState({
    login: "",
    password: "",
    room: DEFAULT_ROOM,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // ✅ Валидация комнаты
    if (!formData.room) {
      setError("Выберите комнату");
      return;
    }

    if (!AVAILABLE_ROOMS.includes(formData.room)) {
      setError("Выбрана недопустимая комната");
      return;
    }

    setLoading(true);

    try {
      await loginUser({
        login: formData.login,
        password: formData.password,
      });

      // ✅ Сохраняем выбранную комнату
      sessionStorage.setItem("initialRoom", formData.room);

      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    error,
    loading,
    availableRooms: ROOM_NAMES,
    handleChange,
    handleSubmit,
  };
};
