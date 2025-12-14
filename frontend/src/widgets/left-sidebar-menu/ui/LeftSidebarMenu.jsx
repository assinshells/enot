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
      <div className="side-menu flex-lg-column me-lg-1 ms-lg-0">
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
        <div className="flex-lg-column my-auto">
          <ul
            className="nav nav-pills side-menu-nav justify-content-center"
            role="tablist"
          >
            <li className="nav-item">
              <button
                className="nav-link"
                onClick={handleSettingsClick}
                title="Настройки"
                type="button"
              >
                <i className="bi bi-gear"></i>
              </button>
            </li>

            {/* Mobile Dropdown */}
            <li className="nav-item dropdown profile-user-dropdown d-inline-block d-lg-none">
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
                  onClick={handleSettingsClick}
                >
                  Setting <i className="bi bi-gear float-end text-muted"></i>
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
                  onClick={handleSettingsClick}
                >
                  Setting
                  <i className="bi bi-gear float-end text-muted"></i>
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
      </div>
    </>
  );
};
