/**
 * Login Form - Відрефакторений
 * Використовує useForm для зменшення дублювання
 */
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/shared/lib/hooks/useAuth";
import { useForm } from "@/shared/lib/hooks/useForm";
import { useRoomSelection } from "@/shared/lib/hooks/useRoomSelection";
import { Input, Button, Alert, Card } from "@/shared/ui";

const validateLoginForm = (values) => {
  const errors = {};

  if (!values.nickname || values.nickname.trim().length < 3) {
    errors.nickname = "Никнейм должен быть минимум 3 символа";
  }

  if (!values.password || values.password.length < 6) {
    errors.password = "Пароль должен быть минимум 6 символов";
  }

  return errors;
};

export const LoginForm = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const {
    selectedRoom,
    setSelectedRoom,
    availableRooms,
    validateRoom,
    saveRoom,
  } = useRoomSelection();

  const handleLogin = useCallback(
    async (values) => {
      const roomError = validateRoom();
      if (roomError) {
        throw new Error(roomError);
      }

      saveRoom();

      try {
        await loginUser(values);
        navigate("/");
      } catch (err) {
        if (err.message === "user_not_found") {
          navigate("/email-confirmation", {
            state: {
              nickname: values.nickname,
              password: values.password,
              room: selectedRoom,
            },
          });
        } else {
          throw err;
        }
      }
    },
    [loginUser, navigate, selectedRoom, validateRoom, saveRoom]
  );

  const {
    values,
    errors,
    loading,
    error,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm({ nickname: "", password: "" }, handleLogin, validateLoginForm);

  return (
    <Card>
      <div className="p-3">
        {error && <Alert type="danger">{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <Input
              name="nickname"
              placeholder="Никнейм"
              value={values.nickname}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.nickname}
              required
            />
          </div>

          <div className="mb-3">
            <Input
              type="password"
              name="password"
              placeholder="Пароль"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.password}
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
  );
};
