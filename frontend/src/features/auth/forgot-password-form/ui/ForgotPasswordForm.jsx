/**
 * Feature: Forgot Password Form UI
 * Путь: src/features/auth/forgot-password-form/ui/ForgotPasswordForm.jsx
 */
import { Link } from "react-router-dom";
import { useForgotPassword } from "../model/useForgotPassword";
import { Input, Button, Alert, Card } from "@/shared/ui";

export const ForgotPasswordForm = () => {
  const { email, setEmail, message, error, loading, handleSubmit } =
    useForgotPassword();

  return (
    <Card>
      {error && <Alert type="danger">{error}</Alert>}
      {message && <Alert type="success">{message}</Alert>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <div className="mb-3 bg-soft-light rounded-3">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              helperText="Введите email, указанный при регистрации"
              required
            />
          </div>
        </div>
        <div className="d-grid">
          <Button type="submit" loading={loading} fullWidth>
            Отправить
          </Button>
        </div>
      </form>

      <div className="mt-5 text-center">
        <Link to="/login">Вернуться к входу</Link>
        <p>
          © 2025 Chatvia. Crafted with{" "}
          <i className="bi bi-heart-fill text-danger"></i> by Themesbrand
        </p>
      </div>
    </Card>
  );
};
