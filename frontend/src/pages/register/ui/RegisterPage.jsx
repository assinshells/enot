/**
 * Page: Register
 * Путь: src/pages/register/ui/RegisterPage.jsx
 */
import { RegisterForm } from "@/features/auth";

export const RegisterPage = () => {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};
