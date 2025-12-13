import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

/**
 * Главная страница (защищенная)
 */
const ChatPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <div className="d-md-none p-2 border-bottom">
        <button
          type="button"
          className="btn btn-outline-secondary"
          data-bs-toggle="offcanvas"
          data-bs-target="#rightSidebar"
          aria-controls="rightSidebar"
        >
          Открыть правый сайдбар
        </button>
      </div>
      <div className="container-fluid">
        <div className="row">
          {/* Левый сайдбар */}
          <aside className="col-md-3 col-lg-2 sidebar-left p-3 d-none d-md-block">
            <h5>Левый сайдбар</h5>

            <button className="btn btn-outline-danger" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-2"></i>
              Выйти
            </button>
          </aside>

          {/* Основной контент */}
<main className="col-12 col-md-6 col-lg-8 p-4">

  {/* Окно чата */}
  <div
    className="border rounded p-3 mb-3"
    style={{
      height: '400px',
      overflowY: 'auto',
      backgroundColor: '#fafafa',
    }}
  >
    <div className="">
      <small className="text-muted me-2">07:15:16</small>
      <strong>Пользователь:</strong>
      <div className=" d-inline-block ms-2">
        Привет!
      </div>
    </div>

    <div className="">
      <small className="text-muted me-2">07:15:16</small>
      <strong>Вы:</strong>
      <div className=" d-inline-block ms-2">
        Здравствуйте 👋
      </div>
    </div>

    <div className="">
      <small className="text-muted me-2">07:15:16</small>
      <strong>Пользователь:</strong>
      <div className=" d-inline-block ms-2">
        Как дела?
      </div>
    </div>
  </div>

  {/* Форма отправки */}
  <form>
    <div className="input-group">
      <input
        type="text"
        className="form-control"
        placeholder="Введите сообщение..."
      />
      <button type="button" className="btn btn-primary">
        Отправить
      </button>
    </div>
  </form>
</main>

          {/* Правый сайдбар desktop*/}
          <aside className="col-md-3 col-lg-2 sidebar-right p-3 d-none d-md-block">
            <h5>Правый сайдбар</h5>
            <div className="mt-3">
              <p className="mb-2">
                <strong>Никнейм:</strong> {user?.nickname}
              </p>
              {user?.email && (
                <p className="mb-2">
                  <strong>Email:</strong> {user.email}
                </p>
              )}
              <p className="mb-0">
                <strong>ID:</strong> {user?._id}
              </p>
            </div>
          </aside>

          {/* Футер (левый сайдбар на мобилке)*/}
          <footer className="d-md-none p-3 border-top">
            <h5>Левый сайдбар</h5>
            <ul className="nav flex-column">
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Пункт 1
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Пункт 2
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Пункт 3
                </a>
              </li>
            </ul>
          </footer>

          {/* Offcanvas: правый сайдбар (мобилка)*/}
          <div
            className="offcanvas offcanvas-end"
            tabindex="-1"
            id="rightSidebar"
          >
            <div className="offcanvas-header">
              <h5 className="offcanvas-title">Правый сайдбар</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="offcanvas"
              ></button>
            </div>
            <div className="offcanvas-body">
              <p>Дополнительная информация</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatPage;
