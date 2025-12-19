import { EmailConfirmationForm } from "@/features/auth";

export const EmailConfirmationPage = () => {
  return (
    <>
      <div class="account-pages my-5 pt-sm-5">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-md-8 col-lg-6 col-xl-5">
              <div class="text-center mb-4">
                <h2 className="auth-logo mb-2">Чат Stuff</h2>
                <p className="auth-subtext mb-3">тут щось є. начебто</p>
              </div>
              <EmailConfirmationForm />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5 text-center auth-footer">
        <p>Новый пользователь? Просто введите никнейм и пароль</p>
        <p>
          © 2025 Chatvia. Crafted with{" "}
          <i className="bi bi-heart-fill text-danger"></i> by Themesbrand
        </p>
      </div>
    </>
  );
};
