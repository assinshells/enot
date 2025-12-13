/**
 * Feature: Reset Password Form UI
 * Путь: src/features/auth/reset-password-form/ui/ResetPasswordForm.jsx
 */
import { Link } from "react-router-dom";
import { useResetPassword } from "../model/useResetPassword";
import { Input, Button, Alert, Card } from "@/shared/ui";

export const ResetPasswordForm = () => {
  const {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    loading,
    handleSubmit,
  } = useResetPassword();

  return (
    <Card title="Новый пароль">
      {error && <Alert type="danger">{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <Input
          type="password"
          placeholder="Новый пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />

        <Input
          type="password"
          placeholder="Подтвердите пароль"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={6}
        />

        <Button type="submit" loading={loading} fullWidth>
          Сохранить пароль
        </Button>
      </form>

      <div className="text-center mt-3">
        <Link to="/login">Вернуться к входу</Link>
      </div>
    </Card>
  );
};
