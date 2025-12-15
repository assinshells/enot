import { Link } from "react-router-dom";
import { useRegisterForm } from "../model/useRegisterForm";
import { Input, Button, Alert, Card, ColorPicker } from "@/shared/ui";

export const RegisterForm = () => {
  const {
    formData,
    error,
    loading,
    selectedRoom,
    availableRooms,
    handleChange,
    handleRoomChange,
    handleSubmit,
  } = useRegisterForm();

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
          minLength={3}
          maxLength={30}
        />

        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          helperText="Нужен для восстановления пароля"
        />

        <Input
          type="password"
          name="password"
          placeholder="Пароль"
          value={formData.password}
          onChange={handleChange}
          required
          minLength={6}
        />

        <div className="mb-3">
          <select
            className="form-select"
            id="room"
            name="room"
            value={selectedRoom}
            onChange={(e) => handleRoomChange(e.target.value)}
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
            Вы сразу попадёте в выбранную комнату после регистрации
          </small>
        </div>

        <Button type="submit" loading={loading} fullWidth>
          Зарегистрироваться
        </Button>
      </form>

      <div className="text-center mt-3">
        <p className="mb-0">
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </div>
    </Card>
  );
};
