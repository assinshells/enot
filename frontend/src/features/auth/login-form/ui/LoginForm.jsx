import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/shared/lib/hooks/useAuth";
import { useRoomForm } from "@/shared/lib/hooks/useRoomForm";
import { useFormError } from "@/shared/lib/hooks/useFormError";
import { roomUtils } from "@/shared/lib/utils/roomUtils";
import { Input, Button, Alert, Card } from "@/shared/ui";

export const LoginForm = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const { selectedRoom, setSelectedRoom, availableRooms, validateRoom } =
    useRoomForm();
  const { error, setError, clearError } = useFormError();

  const [formData, setFormData] = useState({
    nickname: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      clearError();

      const roomError = validateRoom();
      if (roomError) {
        setError(roomError);
        return;
      }

      setLoading(true);

      try {
        await loginUser(formData);
        roomUtils.saveRoom(selectedRoom);
        navigate("/");
      } catch (err) {
        if (err.message === "user_not_found") {
          navigate("/email-confirmation", {
            state: {
              nickname: formData.nickname,
              password: formData.password,
              room: selectedRoom,
            },
          });
        } else {
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    },
    [
      formData,
      selectedRoom,
      validateRoom,
      loginUser,
      navigate,
      setError,
      clearError,
    ]
  );

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
