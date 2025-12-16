import { EmailConfirmationForm } from "@/features/auth";

export const EmailConfirmationPage = () => {
  return (
    <>
      <div className="account-pages my-5 pt-sm-5">
        <div className="container">
          <div className="justify-content-center row">
            <div className="col-md-8 col-lg-6 col-xl-5">
              <div className="text-center mb-4">
                <a class="auth-logo mb-5 d-block" href="/">
                  <img src="" alt="" height="30" class="logo logo-dark" />
                  <img src="" alt="" height="30" class="logo logo-light" />
                </a>
                <h1>Chat App</h1>
                <p className="text-muted mb-4">
                  Создайте аккаунт для входа в чат
                </p>
              </div>
              <EmailConfirmationForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
