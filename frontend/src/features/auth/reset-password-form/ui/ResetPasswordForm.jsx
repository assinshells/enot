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
    <>
      <Card>
        {error && <Alert type="danger">{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <div className="mb-3 bg-soft-light rounded-3">
              <Input
                type="password"
                placeholder="Новый пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
          </div>
          <div className="mb-3">
            <div className="mb-3 bg-soft-light rounded-3">
              <Input
                type="password"
                placeholder="Подтвердите пароль"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
          </div>
          <Button type="submit" loading={loading} fullWidth>
            Сохранить пароль
          </Button>
        </form>
      </Card>
      <div className="mt-5 text-center">
        <Link to="/login">Вернуться к входу</Link>
        <p>
          © 2025 Chatvia. Crafted with{" "}
          <i className="bi bi-heart-fill text-danger"></i> by Themesbrand
        </p>
      </div>
    </>
  );
};
