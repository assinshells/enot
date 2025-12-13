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
      <div className="layout-wrapper d-lg-flex">
        {/* Левый сайдбар */}

        <div className="side-menu flex-lg-column me-lg-1 ms-lg-0">
          <div className="flex-lg-column my-auto">
            <ul className="nav side-menu-nav justify-content-center">
              <li className="nav-item" title="">
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
                  aria-haspopup="true"
                  aria-expanded="false"
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

                  <a className="dropdown-item" href="#">
                    Setting{" "}
                    <i className="ri-settings-3-line float-end text-muted"></i>
                  </a>
                  <div className="dropdown-divider"></div>
                  <a className="dropdown-item" href="#" onClick={handleLogout}>
                    Log out{" "}
                    <i className="ri-logout-circle-r-line float-end text-muted"></i>
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
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
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
                  <a className="dropdown-item" href="#">
                    Setting{" "}
                    <i className="ri-settings-3-line float-end text-muted"></i>
                  </a>
                  <div className="dropdown-divider"></div>
                  <a className="dropdown-item" href="#" onClick={handleLogout}>
                    Log out{" "}
                    <i className="ri-logout-circle-r-line float-end text-muted"></i>
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Основной контент */}
        <div className="user-chat w-100 overflow-hidden">
          {/* Окно чата */}
          <div className="d-lg-flex">
            <div className="chat-conversation p-3 p-lg-4">
              <small className="text-muted me-2">07:15:16</small>
              <strong>Пользователь:</strong>
              <div className=" d-inline-block ms-2">Привет!</div>
            </div>

            <div className="">
              <small className="text-muted me-2">07:15:16</small>
              <strong>Вы:</strong>
              <div className=" d-inline-block ms-2">Здравствуйте 👋</div>
            </div>

            <div className="">
              <small className="text-muted me-2">07:15:16</small>
              <strong>Пользователь:</strong>
              <div className=" d-inline-block ms-2">Как дела?</div>
            </div>
          </div>

          {/* Форма отправки */}
          <div className="chat-input-section p-3 p-lg-4 border-top mb-0">
            <div className="row g-0">
              <div className="col">
                <input
                  type="text"
                  className="form-control form-control-lg bg-light border-light"
                  placeholder="Enter Message..."
                />
              </div>
              <div className="col-auto">
                <div className="chat-input-links ms-md-2 me-md-0">
                  <ul className="list-inline mb-0">
                    <li
                      className="list-inline-item"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="Emoji"
                    >
                      <button
                        type="button"
                        className="btn btn-link text-decoration-none font-size-16 btn-lg waves-effect"
                      >
                        <i className="ri-emotion-happy-line"></i>
                      </button>
                    </li>
                    <li
                      className="list-inline-item"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="Attached File"
                    >
                      <button
                        type="button"
                        className="btn btn-link text-decoration-none font-size-16 btn-lg waves-effect"
                      >
                        <i className="ri-attachment-line"></i>
                      </button>
                    </li>
                    <li className="list-inline-item">
                      <button
                        type="submit"
                        className="btn btn-primary font-size-16 btn-lg chat-send waves-effect waves-light"
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

      {/*модальное окно вызывать из левого сайдбара(профиль)*/}
      {/* Backdrop */}
      <div
        className="modal-backdrop fade show"
        onClick={onClose}
        style={{ zIndex: 1040 }}
      ></div>

      {/* Modal */}
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        style={{ zIndex: 1050 }}
        onClick={(e) => {
          // Закрываем только при клике на backdrop
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                <i className="bi bi-gear-fill me-2"></i>
                Настройки
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label fw-bold">
                  <i className="bi bi-palette-fill me-2"></i>
                  Внешний вид
                </label>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>
                <i className="bi bi-x-lg me-2"></i>
                Закрыть
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatPage;
