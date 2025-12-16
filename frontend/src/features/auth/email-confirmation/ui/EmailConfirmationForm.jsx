import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/shared/lib/hooks/useAuth";
import { useFormError } from "@/shared/lib/hooks/useFormError";
import {
  Input,
  Button,
  Alert,
  Card,
  ColorPicker,
  GenderPicker,
} from "@/shared/ui";
import { roomUtils } from "@/shared/lib/utils/roomUtils";

export const EmailConfirmationForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { registerUser } = useAuth();
  const { error, setError, clearError } = useFormError();

  const [email, setEmail] = useState("");
  const [selectedColor, setSelectedColor] = useState("black");
  const [selectedGender, setSelectedGender] = useState("male");
  const [loading, setLoading] = useState(false);

  const { nickname, password, room } = location.state || {};

  useEffect(() => {
    if (!nickname || !password || !room) {
      navigate("/login");
    }
  }, [nickname, password, room, navigate]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      clearError();
      setLoading(true);

      try {
        const captchaToken =
          process.env.NODE_ENV === "production" ? "" : "dev_mode";

        const registrationData = {
          nickname,
          password,
          color: selectedColor,
          gender: selectedGender,
          captchaToken,
        };

        if (email && email.trim()) {
          registrationData.email = email.trim();
        }

        await registerUser(registrationData);

        roomUtils.saveRoom(room);
        navigate("/");
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [
      nickname,
      password,
      email,
      selectedColor,
      selectedGender,
      room,
      registerUser,
      navigate,
      setError,
      clearError,
    ]
  );

  if (!nickname) return null;

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

        <div className="mb-3">
          <label className="form-label">Цвет никнейма и сообщений</label>
          <ColorPicker
            value={selectedColor}
            onChange={setSelectedColor}
            disabled={loading}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Пол</label>
          <GenderPicker
            value={selectedGender}
            onChange={setSelectedGender}
            disabled={loading}
          />
        </div>

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
