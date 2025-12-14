/**
 * Widget: Sidebar (ИСПРАВЛЕНО)
 * Путь: src/widgets/sidebar/ui/Sidebar.jsx
 */
import { useAuth } from "@/shared/lib/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

export const Sidebar = ({ onOpenSettings }) => {
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
    <div className="side-menu flex-lg-column me-lg-1 ms-lg-0">
      <div className="flex-lg-column my-auto">
        <ul className="nav side-menu-nav justify-content-center">
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
            <button
              className="nav-link dropdown-toggle no-caret"
              type="button"
              data-bs-toggle="dropdown"
            >
              <i className="bi bi-list"></i>
            </button>
            <div className="dropdown-menu">
              <button className="dropdown-item" onClick={handleSettingsClick}>
                <i className="bi bi-gear float-end text-muted"></i>
                Настройки
              </button>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right float-end text-muted"></i>
                Выход
              </button>
            </div>
          </li>
        </ul>
      </div>

      {/* Desktop Bottom Menu */}
      <div className="flex-lg-column d-none d-lg-block">
        <ul className="nav side-menu-nav justify-content-center">
          <li className="nav-item btn-group dropup profile-user-dropdown">
            <button
              className="nav-link dropdown-toggle no-caret"
              type="button"
              data-bs-toggle="dropdown"
            >
              <i className="bi bi-list"></i>
            </button>
            <div className="dropdown-menu">
              <button className="dropdown-item" onClick={handleSettingsClick}>
                <i className="bi bi-gear float-end text-muted"></i>
                Настройки
              </button>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right float-end text-muted"></i>
                Выход
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};
