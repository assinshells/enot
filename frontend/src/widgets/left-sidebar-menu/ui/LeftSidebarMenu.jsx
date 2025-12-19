/**
 * Widget: Left Sidebar Menu
 * Путь: src/widgets/left-sidebar-menu/ui/LeftSidebarMenu.jsx
 */
import { useAuth } from "@/shared/lib/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import chatLogo from "../../../assets/react.svg";
import "./LeftSidebarMenu.css";

export const LeftSidebarMenu = ({ onOpenSettings }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSettingsClick = (e) => {
    e.preventDefault();
    onOpenSettings();
  };

  return (
    <>
      {/* start left sidebar-menu */}
      <div className="side-menu flex-lg-column me-lg-1 ms-lg-0">
        {/* start navbar-brand-box */}
        <div className="navbar-brand-box">
          <a href="#" className="logo logo-dark">
            <span className="logo-sm">
              <img src={chatLogo} alt="" height="30" />
            </span>
          </a>

          <a href="#" className="logo logo-light">
            <span className="logo-sm">
              <img src={chatLogo} alt="" height="30" />
            </span>
          </a>
        </div>
        {/* end navbar-brand-box */}

        {/* start side-menu nav*/}
        <div className="flex-lg-column my-auto">
          <ul
            className="nav nav-pills side-menu-nav justify-content-center"
            role="tablist"
          >
            <li className="nav-item" title="Profile">
              <a
                className="nav-link"
                id="pills-user-tab"
                data-bs-toggle="pill"
                href="#pills-user"
                role="tab"
              >
                <i className="bi bi-person"></i>
              </a>
            </li>
            <li className="nav-item" title="Chat">
              <a
                className="nav-link active"
                id="pills-rooms-tab"
                data-bs-toggle="pill"
                href="#pills-rooms"
                role="tab"
              >
                <i className="bi bi-chat-right-dots"></i>
              </a>
            </li>
            <li className="nav-item" title="Users">
              <a
                className="nav-link"
                id="pills-users-tab"
                data-bs-toggle="pill"
                href="#pills-users"
                role="tab"
              >
                <i className="bi bi-people"></i>
              </a>
            </li>
            <li className="nav-item" title="Settings">
              <a
                className="nav-link"
                href="#"
                role="button"
                onClick={handleSettingsClick}
              >
                <i className="bi bi-gear"></i>
              </a>
            </li>

            {/* start Mobile Dropdown */}
            <li className="nav-item dropdown profile-user-dropdown d-inline-block d-lg-none">
              <a
                className="nav-link dropdown-toggle no-caret"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i className="bi bi-three-dots"></i>
              </a>
              <div className="dropdown-menu">
                <a className="dropdown-item" href="#">
                  Profile <i className="bi bi-person float-end text-muted"></i>
                </a>
                <div className="dropdown-divider"></div>
                <a className="dropdown-item" href="#" onClick={handleLogout}>
                  Log out
                  <i className="bi bi-box-arrow-right float-end text-muted"></i>
                </a>
              </div>
            </li>
            {/* end Mobile Dropdown */}
          </ul>
        </div>
        {/* end side-menu nav */}

        {/* start Desktop Bottom Menu */}
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
                <i className="bi bi-three-dots"></i>
              </a>

              <div className="dropdown-menu">
                <a className="dropdown-item" href="#">
                  Profile
                  <i className="bi bi-person float-end text-muted"></i>
                </a>
                <div className="dropdown-divider"></div>
                <a className="dropdown-item" href="#" onClick={handleLogout}>
                  Log out
                  <i className="bi bi-box-arrow-right float-end text-muted"></i>
                </a>
              </div>
            </li>
          </ul>
        </div>
        {/* end Desktop Bottom Menu */}
      </div>
      {/* end left sidebar-menu */}
    </>
  );
};
