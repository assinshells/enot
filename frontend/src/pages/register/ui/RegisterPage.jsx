/**
 * Page: Register
 * Путь: src/pages/register/ui/RegisterPage.jsx
 */
import { RegisterForm } from "@/features/auth";

export const RegisterPage = () => {
  return (
    <div className="account-pages my-5 pt-sm-5">
      <div className="container">
        <div className="justify-content-center row">
          <div className="col-md-8 col-lg-6 col-xl-5">
            <div className="text-center mb-4">
              <a class="auth-logo mb-5 d-block" href="/">
                <img src="" alt="" height="30" class="logo logo-dark" />
                <img src="" alt="" height="30" class="logo logo-light" />
              </a>
              <h4>Register</h4>
              <p class="text-muted mb-4">Get your Chatvia account now</p>
            </div>
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
};
