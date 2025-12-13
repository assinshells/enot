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
      <div class="layout-wrapper d-lg-flex">
          {/* Левый сайдбар */}

          <div class="side-menu flex-lg-column me-lg-1 ms-lg-0">
             
                <div class="navbar-brand-box">
                    <a href="index.html" class="logo logo-dark">
                        <span class="logo-sm">
                            <img src="assets/images/logo.svg" alt="" height="30"/>
                        </span>
                    </a>

                    <a href="index.html" class="logo logo-light">
                        <span class="logo-sm">
                            <img src="assets/images/logo.svg" alt="" height="30"/>
                        </span>
                    </a>
                </div>

                <div class="flex-lg-column my-auto">
                    <ul class="nav nav-pills side-menu-nav justify-content-center" role="tablist">
                        <li class="nav-item" data-bs-toggle="tooltip" data-bs-placement="top" title="Profile">
                            <a class="nav-link" id="pills-user-tab" data-bs-toggle="pill" href="#pills-user" role="tab">
                                <i class="ri-user-2-line"></i>
                            </a>
                        </li>
                        <li class="nav-item" data-bs-toggle="tooltip" data-bs-placement="top" title="Chats">
                            <a class="nav-link active" id="pills-chat-tab" data-bs-toggle="pill" href="#pills-chat" role="tab">
                                <i class="ri-message-3-line"></i>
                            </a>
                        </li>
                        <li class="nav-item" data-bs-toggle="tooltip" data-bs-placement="top" title="Groups">
                            <a class="nav-link" id="pills-groups-tab" data-bs-toggle="pill" href="#pills-groups" role="tab">
                                <i class="ri-group-line"></i>
                            </a>
                        </li>
                        <li class="nav-item" data-bs-toggle="tooltip" data-bs-placement="top" title="Contacts">
                            <a class="nav-link" id="pills-contacts-tab" data-bs-toggle="pill" href="#pills-contacts" role="tab">
                                <i class="ri-contacts-line"></i>
                            </a>
                        </li>
                        <li class="nav-item" data-bs-toggle="tooltip" data-bs-placement="top" title="Settings">
                            <a class="nav-link" id="pills-setting-tab" data-bs-toggle="pill" href="#pills-setting" role="tab">
                                <i class="ri-settings-2-line"></i>
                            </a>
                        </li>
                        <li class="nav-item dropdown profile-user-dropdown d-inline-block d-lg-none">
                            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <img src="assets/images/users/avatar-1.jpg" alt="" class="profile-user rounded-circle" />
                            </a>
                            <div class="dropdown-menu">
                                <a class="dropdown-item" href="#">Profile <i class="ri-profile-line float-end text-muted"></i></a>
                                <a class="dropdown-item" href="#">Setting <i class="ri-settings-3-line float-end text-muted"></i></a>
                                <div class="dropdown-divider"></div>
                                <a class="dropdown-item" href="#" onClick={handleLogout}>Log out <i class="ri-logout-circle-r-line float-end text-muted"></i></a>
                            </div>
                        </li>
                    </ul>
                </div>
               

                <div class="flex-lg-column d-none d-lg-block">
                    <ul class="nav side-menu-nav justify-content-center">
                        <li class="nav-item">
                            <a class="nav-link light-dark-mode" href="#" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-placement="right" title="Dark / Light Mode">
                                <i class='ri-sun-line theme-mode-icon'></i>
                            </a>
                        </li>

                        <li class="nav-item btn-group dropup profile-user-dropdown">
                            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <img src="assets/images/users/avatar-1.jpg" alt="" class="profile-user rounded-circle"/>
                            </a>
                            <div class="dropdown-menu">
                                <a class="dropdown-item" href="#">Profile <i class="ri-profile-line float-end text-muted"></i></a>
                                <a class="dropdown-item" href="#">Setting <i class="ri-settings-3-line float-end text-muted"></i></a>
                                <div class="dropdown-divider"></div>
                                <a class="dropdown-item" href="#" onClick={handleLogout}>Log out <i class="ri-logout-circle-r-line float-end text-muted"></i></a>
                            </div>
                        </li>
                    </ul>
                </div>
             
            </div>

          {/* Основной контент */}
<div class="user-chat w-100 overflow-hidden">

  {/* Окно чата */}
  <div class="d-lg-flex">
    <div className="chat-conversation p-3 p-lg-4">
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
<div class="chat-input-section p-3 p-lg-4 border-top mb-0">
                            
                            <div class="row g-0">
                                
                                <div class="col">
                                    <input type="text" class="form-control form-control-lg bg-light border-light" placeholder="Enter Message..." />
                                </div>
                                <div class="col-auto">
                                    <div class="chat-input-links ms-md-2 me-md-0">
                                        <ul class="list-inline mb-0">
                                            <li class="list-inline-item" data-bs-toggle="tooltip" data-bs-placement="top" title="Emoji">
                                                <button type="button" class="btn btn-link text-decoration-none font-size-16 btn-lg waves-effect">
                                                    <i class="ri-emotion-happy-line"></i>
                                                </button>
                                            </li>
                                            <li class="list-inline-item" data-bs-toggle="tooltip" data-bs-placement="top" title="Attached File">  
                                                <button type="button" class="btn btn-link text-decoration-none font-size-16 btn-lg waves-effect">
                                                    <i class="ri-attachment-line"></i>
                                                </button>
                                            </li>
                                            <li class="list-inline-item">
                                                <button type="submit" class="btn btn-primary font-size-16 btn-lg chat-send waves-effect waves-light">
                                                    <i class="ri-send-plane-2-fill"></i>
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
    </>
  );
};

export default ChatPage;
