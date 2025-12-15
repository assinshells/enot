/**
 * Page: Login
 * Путь: src/pages/login/ui/LoginPage.jsx
 */
import { LoginForm } from "@/features/auth";

export const LoginPage = () => {
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
              <h4>Sign in</h4>
              <p class="text-muted mb-4">Sign in to continue to Chatvia.</p>
            </div>
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};
