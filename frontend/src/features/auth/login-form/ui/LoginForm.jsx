import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/shared/lib/hooks/useAuth";
import { useRoomForm } from "@/shared/lib/hooks/useRoomForm";
import { roomUtils } from "@/shared/lib/utils/roomUtils";
import { authApi } from "@/entities/user";
import { Input, Button, Alert, Card } from "@/shared/ui";

export const LoginForm = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const { selectedRoom, setSelectedRoom, availableRooms, validateRoom } =
    useRoomForm();

  const [formData, setFormData] = useState({
    nickname: "",
    password: "",
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
      // Пытаемся войти
      const response = await loginUser(formData);
      roomUtils.saveRoom(selectedRoom);
      navigate("/");
    } catch (err) {
      // Если ошибка "user_not_found" - переходим на страницу email confirmation
      if (err.message === "user_not_found") {
        navigate("/email-confirmation", {
          state: {
            nickname: formData.nickname,
            password: formData.password,
            room: selectedRoom,
          },
        });
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      {error && <Alert type="danger">{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <Input
          name="nickname"
          placeholder="Никнейм"
          value={formData.nickname}
          onChange={handleChange}
          required
        />
        <Input
          type="password"
          name="password"
          placeholder="Пароль"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <div className="mb-3">
          <select
            className="form-select border-light bg-soft-light"
            id="room"
            name="room"
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            required
          >
            <option value="" disabled>
              Выберите комнату...
            </option>
            {availableRooms.map((room) => (
              <option key={room} value={room}>
                {room}
              </option>
            ))}
          </select>
          <small className="text-muted">
            Вы войдёте в выбранную комнату после входа
          </small>
        </div>

        <Button type="submit" loading={loading} fullWidth>
          Войти
        </Button>
      </form>

      <div className="text-center mt-3">
        <p className="text-muted mb-0">
          Новый пользователь? Просто введите никнейм и пароль
        </p>
      </div>
    </Card>
  );
};
