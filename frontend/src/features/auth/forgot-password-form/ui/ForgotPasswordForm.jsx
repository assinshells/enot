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
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          helperText="Введите email, указанный при регистрации"
          required
        />

        <Button type="submit" loading={loading} fullWidth>
          Отправить
        </Button>
      </form>

      <div className="text-center mt-3">
        <Link to="/login">Вернуться к входу</Link>
      </div>
    </Card>
  );
};
