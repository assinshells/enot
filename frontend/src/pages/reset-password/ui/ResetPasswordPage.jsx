/**
 * Page: Reset Password
 * Путь: src/pages/reset-password/ui/ResetPasswordPage.jsx
 */
import { ResetPasswordForm } from "@/features/auth";

export const ResetPasswordPage = () => {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <ResetPasswordForm />
        </div>
      </div>
    </div>
  );
};
