import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/shared/lib/hooks/useAuth";
import { ROOM_NAMES, DEFAULT_ROOM, isValidRoom } from "@/shared/config/rooms";

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

    if (!formData.room || !isValidRoom(formData.room)) {
      setError("Выберите корректную комнату");
      return;
    }

    setLoading(true);

    try {
      await loginUser({
        login: formData.login,
        password: formData.password,
      });

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
