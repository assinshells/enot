import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/shared/lib/hooks/useAuth";

const AVAILABLE_ROOMS = ["Главная", "Знакомства", "Беспредел"];

export const useRegisterForm = () => {
  const navigate = useNavigate();
  const { registerUser } = useAuth();

  const [formData, setFormData] = useState({
    nickname: "",
    email: "",
    password: "",
    room: "", // ✅ НОВОЕ: выбранная комната
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
      // Регистрируем пользователя
      await registerUser({
        nickname: formData.nickname,
        email: formData.email,
        password: formData.password,
      });

      // ✅ Сохраняем выбранную комнату в sessionStorage
      sessionStorage.setItem("initialRoom", formData.room);

      // Переходим в чат
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
    availableRooms: AVAILABLE_ROOMS,
    handleChange,
    handleSubmit,
  };
};
