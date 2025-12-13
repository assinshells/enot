/**
 * Page: Chat (Временная версия - будет разбита на widgets)
 * Путь: src/pages/chat/ui/ChatPage.jsx
 */
import { useAuth } from "@/shared/lib/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export const ChatPage = () => {
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
        >
          Открыть правый сайдбар
        </button>
      </div>

      <div className="layout-wrapper d-lg-flex">
        {/* Левый сайдбар */}
        <div className="side-menu flex-lg-column me-lg-1 ms-lg-0">
          <div className="flex-lg-column my-auto">
            <ul className="nav side-menu-nav justify-content-center">
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="#"
                  onClick={(e) => e.preventDefault()}
                >
                  <i className="bi bi-person"></i>
                </a>
              </li>

              {/* Mobile Dropdown */}
              <li className="nav-item dropdown profile-user-dropdown d-inline-block d-lg-none">
                <a
                  className="nav-link dropdown-toggle no-caret"
                  href="#"
                  data-bs-toggle="dropdown"
                >
                  <i className="bi bi-list"></i>
                </a>
                <div className="dropdown-menu">
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={(e) => e.preventDefault()}
                  >
                    <i className="bi bi-person float-end text-muted"></i>
                    Профиль
                  </a>
                  <div className="dropdown-divider"></div>
                  <a className="dropdown-item" href="#" onClick={handleLogout}>
                    <i className="ri-logout-circle-r-line float-end text-muted"></i>
                    Выход
                  </a>
                </div>
              </li>
            </ul>
          </div>

          {/* Desktop Bottom Menu */}
          <div className="flex-lg-column d-none d-lg-block">
            <ul className="nav side-menu-nav justify-content-center">
              <li className="nav-item btn-group dropup profile-user-dropdown">
                <a
                  className="nav-link dropdown-toggle no-caret"
                  href="#"
                  data-bs-toggle="dropdown"
                >
                  <i className="bi bi-list"></i>
                </a>
                <div className="dropdown-menu">
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={(e) => e.preventDefault()}
                  >
                    <i className="bi bi-person float-end text-muted"></i>
                    Профиль
                  </a>
                  <div className="dropdown-divider"></div>
                  <a className="dropdown-item" href="#" onClick={handleLogout}>
                    <i className="ri-logout-circle-r-line float-end text-muted"></i>
                    Выход
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Основной контент */}
        <div className="user-chat w-100 overflow-hidden">
          <div className="d-lg-flex">
            <div className="chat-conversation p-3 p-lg-4">
              <div className="mb-3">
                <small className="text-muted me-2">07:15:16</small>
                <strong>Пользователь:</strong>
                <div className="d-inline-block ms-2">Привет!</div>
              </div>

              <div className="mb-3">
                <small className="text-muted me-2">07:15:16</small>
                <strong>Вы:</strong>
                <div className="d-inline-block ms-2">Здравствуйте 👋</div>
              </div>
            </div>
          </div>

          {/* Форма отправки */}
          <div className="chat-input-section p-3 p-lg-4 border-top mb-0">
            <div className="row g-0">
              <div className="col">
                <input
                  type="text"
                  className="form-control form-control-lg bg-light border-light"
                  placeholder="Введите сообщение..."
                />
              </div>
              <div className="col-auto">
                <div className="chat-input-links ms-md-2">
                  <ul className="list-inline mb-0">
                    <li className="list-inline-item">
                      <button
                        type="button"
                        className="btn btn-link text-decoration-none font-size-16 btn-lg"
                      >
                        <i className="ri-emotion-happy-line"></i>
                      </button>
                    </li>
                    <li className="list-inline-item">
                      <button
                        type="submit"
                        className="btn btn-primary font-size-16 btn-lg"
                      >
                        <i className="ri-send-plane-2-fill"></i>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Правый сайдбар */}
        <aside className="col-md-3 col-lg-2 sidebar-right p-3 d-none d-md-block">
          <h5>Профиль</h5>
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

        {/* Mobile Offcanvas */}
        <div
          className="offcanvas offcanvas-end"
          tabIndex="-1"
          id="rightSidebar"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title">Профиль</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
            ></button>
          </div>
          <div className="offcanvas-body">
            <p>
              <strong>Никнейм:</strong> {user?.nickname}
            </p>
            {user?.email && (
              <p>
                <strong>Email:</strong> {user.email}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
