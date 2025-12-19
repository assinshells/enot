import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/shared/lib/hooks/useAuth";
import { useFormError } from "@/shared/lib/hooks/useFormError";
import { useRoomSelection } from "@/shared/lib/hooks/useRoomSelection";
import { Input, Button, Alert, Card } from "@/shared/ui";

export const LoginForm = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const { error, setError, clearError } = useFormError();
  const {
    selectedRoom,
    setSelectedRoom,
    availableRooms,
    validateRoom,
    saveRoom,
  } = useRoomSelection();

  const [formData, setFormData] = useState({ nickname: "", password: "" });
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
        saveRoom();
        await loginUser(formData);
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
      loginUser,
      navigate,
      setError,
      clearError,
      validateRoom,
      saveRoom,
    ]
  );

  return (
    <>
      <Card>
        <div className="p-3">
          {error && <Alert type="danger">{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <Input
                name="nickname"
                placeholder="Никнейм"
                value={formData.nickname}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <Input
                type="password"
                name="password"
                placeholder="Пароль"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <select
                className="form-select auth-select"
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
            </div>
            <div className="d-grid">
              <Button type="submit" loading={loading} fullWidth>
                Войти
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </>
  );
};
