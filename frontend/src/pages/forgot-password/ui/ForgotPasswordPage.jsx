/**
 * Page: Forgot Password
 * Путь: src/pages/forgot-password/ui/ForgotPasswordPage.jsx
 */
import { ForgotPasswordForm } from "@/features/auth";

export const ForgotPasswordPage = () => {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
};
