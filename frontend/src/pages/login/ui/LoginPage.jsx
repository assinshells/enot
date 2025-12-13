/**
 * Page: Login
 * Путь: src/pages/login/ui/LoginPage.jsx
 */
import { LoginForm } from "@/features/auth";

export const LoginPage = () => {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};
