/**
 * Feature: Login Form UI
 * Путь: src/features/auth/login-form/ui/LoginForm.jsx
 */
import { Link } from "react-router-dom";
import { useLoginForm } from "../model/useLoginForm";
import { Input, Button, Alert, Card } from "@/shared/ui";

export const LoginForm = () => {
  const { formData, error, loading, handleChange, handleSubmit } =
    useLoginForm();

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
