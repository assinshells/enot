import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/shared/lib/hooks/useAuth";
import { useRoomForm } from "@/shared/lib/hooks/useRoomForm";
import { roomUtils } from "@/shared/lib/utils/roomUtils";

export const useRegisterForm = () => {
  const navigate = useNavigate();
  const { registerUser } = useAuth();
  const { selectedRoom, setSelectedRoom, availableRooms, validateRoom } =
    useRoomForm();

  const [formData, setFormData] = useState({
    nickname: "",
    email: "",
    password: "",
    // ИСПРАВЛЕНО: убрали color из formData, т.к. бэкенд не принимает его при регистрации
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

    const roomError = validateRoom();
    if (roomError) {
      setError(roomError);
      return;
    }

    setLoading(true);

    try {
      // ИСПРАВЛЕНО: отправляем только nickname, email, password
      await registerUser(formData);
      roomUtils.saveRoom(selectedRoom);
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
    selectedRoom,
    availableRooms,
    handleChange,
    handleRoomChange: setSelectedRoom,
    handleSubmit,
  };
};
