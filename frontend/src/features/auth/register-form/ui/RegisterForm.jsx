/**
 * Feature: Register Form UI
 * Путь: src/features/auth/register-form/ui/RegisterForm.jsx
 */
import { Link } from "react-router-dom";
import { useRegisterForm } from "../model/useRegisterForm";
import { Input, Button, Alert, Card } from "@/shared/ui";

export const RegisterForm = () => {
  const { formData, error, loading, handleChange, handleSubmit } =
    useRegisterForm();

  return (
    <Card title="Регистрация">
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
