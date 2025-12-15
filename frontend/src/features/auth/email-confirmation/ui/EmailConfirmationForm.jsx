import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/shared/lib/hooks/useAuth";
import { authApi } from "@/entities/user";
import { Input, Button, Alert, Card } from "@/shared/ui";
import { roomUtils } from "@/shared/lib/utils/roomUtils";

export const EmailConfirmationForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { registerUser } = useAuth();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Получаем данные из state (nickname, password, room)
  const { nickname, password, room } = location.state || {};

  useEffect(() => {
    // Если нет данных для регистрации - редирект на логин
    if (!nickname || !password || !room) {
      navigate("/login");
    }
  }, [nickname, password, room, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Регистрация с email (капча в dev режиме не проверяется)
      const captchaToken =
        process.env.NODE_ENV === "production" ? "" : "dev_mode";

      await registerUser({
        nickname,
        password,
        email: email || undefined,
        captchaToken,
      });

      // Сохраняем комнату
      roomUtils.saveRoom(room);

      // Переходим в чат
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!nickname) {
    return null;
  }

  return (
    <Card>
      {error && <Alert type="danger">{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Никнейм</label>
          <input
            type="text"
            className="form-control"
            value={nickname}
            disabled
          />
        </div>

        <Input
          type="email"
          placeholder="Email (опционально)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          helperText="Нужен для восстановления пароля"
        />

        {process.env.NODE_ENV === "production" && (
          <div className="mb-3">
            <div className="alert alert-info">
              <i className="bi bi-shield-check me-2"></i>В production здесь
              будет капча
            </div>
          </div>
        )}

        <Button type="submit" loading={loading} fullWidth>
          Подтвердить и войти
        </Button>
      </form>

      <div className="text-center mt-3">
        <button
          className="btn btn-link"
          onClick={() => navigate("/login")}
          disabled={loading}
        >
          Вернуться к входу
        </button>
      </div>
    </Card>
  );
};
