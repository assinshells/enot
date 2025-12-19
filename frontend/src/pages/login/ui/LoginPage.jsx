/**
 * Page: Login
 * Путь: src/pages/login/ui/LoginPage.jsx
 */
import { LoginForm } from "@/features/auth";

export const LoginPage = () => {
  return (
    <>
      <div className="account-pages my-4 pt-sm-4">
        <div className="container">
          <div className="justify-content-center row">
            <div className="col-md-8 col-lg-6 col-xl-5">
              <div className="text-center mb-4">
                <h1>Chat App</h1>
                <p className="text-muted mb-4">
                  Создайте аккаунт для входа в чат
                </p>
              </div>
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
