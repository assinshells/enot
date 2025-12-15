import { Link } from "react-router-dom";
import { useLoginForm } from "../model/useLoginForm";
import { Input, Button, Alert, Card } from "@/shared/ui";

export const LoginForm = () => {
  const {
    formData,
    error,
    loading,
    selectedRoom,
    availableRooms,
    handleChange,
    handleRoomChange,
    handleSubmit,
  } = useLoginForm();

  return (
    <Card title="Вход">
      {error && <Alert type="danger">{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <Input
          name="login"
          placeholder="Никнейм или Email"
          value={formData.login}
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
          <label htmlFor="room" className="form-label">
            Комната
          </label>
          <select
            className="form-select"
            id="room"
            name="room"
            value={selectedRoom}
            onChange={(e) => handleRoomChange(e.target.value)}
            required
          >
            <option value="">Выберите комнату...</option>
            {availableRooms.map((room) => (
              <option key={room} value={room}>
                {room}
              </option>
            ))}
          </select>
          <small className="text-muted">
            Вы войдёте в выбранную комнату после авторизации
          </small>
        </div>

        <div className="mb-3">
          <Link to="/forgot-password" className="text-decoration-none">
            Забыли пароль?
          </Link>
        </div>

        <Button type="submit" loading={loading} fullWidth>
          Войти
        </Button>
      </form>

      <div className="text-center mt-3">
        <p className="mb-0">
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </p>
      </div>
    </Card>
  );
};
