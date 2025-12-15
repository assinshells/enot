import { EmailConfirmationForm } from "@/features/auth";

export const EmailConfirmationPage = () => {
  return (
    <div className="account-pages my-5 pt-sm-5">
      <div className="container">
        <div className="justify-content-center row">
          <div className="col-md-8 col-lg-6 col-xl-5">
            <div className="text-center mb-4">
              <h4>Подтверждение регистрации</h4>
              <p className="text-muted mb-4">
                Пожалуйста, укажите email и пройдите проверку
              </p>
            </div>
            <EmailConfirmationForm />
          </div>
        </div>
      </div>
    </div>
  );
};
