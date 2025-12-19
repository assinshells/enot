/**
 * Page: Login
 * Путь: src/pages/login/ui/LoginPage.jsx
 */
import { LoginForm } from "@/features/auth";

export const LoginPage = () => {
  return (
    <>
      <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 bg-light">
        <div className="text-center mb-4">
          <h2 className="auth-logo mb-2">Чат Stuff</h2>
          <p className="auth-subtext mb-3">тут щось є. начебто</p>
        </div>
        <LoginForm />
      </div>
      <div className="auth-footer text-center mt-2">
        <p>Новый пользователь? Просто введите никнейм и пароль</p>
        <p>
          © 2025 Chatvia. Crafted with{" "}
          <i className="bi bi-heart-fill text-danger"></i> by Themesbrand
        </p>
      </div>
    </>
  );
};
