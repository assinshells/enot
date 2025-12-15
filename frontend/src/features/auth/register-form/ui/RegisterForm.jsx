import { Link } from "react-router-dom";
import { useRegisterForm } from "../model/useRegisterForm";
import { Input, Button, Alert, Card } from "@/shared/ui";

const COLOR_OPTIONS = [
  { value: "black", label: "Черный", color: "#000000" },
  { value: "blue", label: "Синий", color: "#0d6efd" },
  { value: "green", label: "Зеленый", color: "#198754" },
  { value: "orange", label: "Оранжевый", color: "#fd7e14" },
];

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
          <label className="form-label">Цвет никнейма</label>
          <div className="d-flex gap-2">
            {COLOR_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`btn ${
                  formData.color === option.value
                    ? "btn-primary"
                    : "btn-outline-secondary"
                }`}
                style={{
                  flex: 1,
                  backgroundColor:
                    formData.color === option.value
                      ? option.color
                      : "transparent",
                  borderColor: option.color,
                  color:
                    formData.color === option.value ? "#fff" : option.color,
                }}
                onClick={() =>
                  handleChange({
                    target: { name: "color", value: option.value },
                  })
                }
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

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
