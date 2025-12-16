import { EmailConfirmationForm } from "@/features/auth";

export const EmailConfirmationPage = () => {
  return (
    <>
      <div className="container d-flex vh-100  justify-content-center align-items-center">
        <div className="row w-100 justify-content-around gap-5">
          <div className="left col-lg-5 col-md-12 text-center text-lg-start pt-5">
            <h1 className="text-primary mb-3">Chat App</h1>
            <div className="fs-4">Создайте аккаунт для входа в чат</div>
            <div className="d-none d-md-block">
              галерея(здесь будут фото пользователей)
            </div>
          </div>
          <EmailConfirmationForm />
        </div>
      </div>
    </>
  );
};
