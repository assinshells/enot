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
        sessionStorage.setItem("currentRoom", room);
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
    <>
      <Card>
        {error && <Alert type="danger">{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3 bg-soft-light rounded-3">
            <input
              type="text"
              className="form-control"
              value={nickname}
              disabled
            />
          </div>

          <div className="mb-3 bg-soft-light rounded-3">
            <Input
              type="email"
              placeholder="Email (опционально)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              helperText="Нужен для восстановления пароля"
            />
          </div>

          <div className="mb-3 bg-soft-light rounded-3">
            <ColorPicker
              value={selectedColor}
              onChange={setSelectedColor}
              disabled={loading}
            />
          </div>

          <div className="mb-3 bg-soft-light rounded-3">
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

          <div className="d-grid">
            <Button type="submit" loading={loading} fullWidth>
              Подтвердить и войти
            </Button>
          </div>
        </form>
      </Card>

      <div className="mt-5 text-center">
        <button
          className="btn btn-link"
          onClick={() => navigate("/login")}
          disabled={loading}
        >
          Вернуться к входу
        </button>
        <p>
          © 2025 Chatvia. Crafted with{" "}
          <i className="bi bi-heart-fill text-danger"></i> by Themesbrand
        </p>
      </div>
    </>
  );
};
