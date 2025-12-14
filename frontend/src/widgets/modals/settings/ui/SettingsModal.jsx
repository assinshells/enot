/**
 * Widget: Settings Modal v2 (Pure React - без Bootstrap JS)
 * Путь: src/widgets/modals/settings/ui/SettingsModal.jsx
 */
import { useEffect } from "react";
import { useAuth } from "@/shared/lib/hooks/useAuth";
import "./SettingsModal.css";

export const SettingsModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  // Блокировка скролла при открытии модального окна
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Закрытие по клавише Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="modal-backdrop-custom" onClick={onClose} />

      {/* Modal */}
      <div className="modal-custom">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                <i className="bi bi-gear me-2"></i>
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
                <h6 className="text-muted mb-2">Профиль</h6>
                <div className="card">
                  <div className="card-body">
                    <p className="mb-2">
                      <strong>Никнейм:</strong> {user?.nickname}
                    </p>
                    {user?.email && (
                      <p className="mb-2">
                        <strong>Email:</strong> {user.email}
                      </p>
                    )}
                    <p className="mb-0">
                      <strong>ID:</strong>{" "}
                      <code className="text-break">{user?._id}</code>
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <h6 className="text-muted mb-2">Уведомления</h6>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="notificationsSwitch"
                    defaultChecked
                  />
                  <label
                    className="form-check-label"
                    htmlFor="notificationsSwitch"
                  >
                    Включить звуковые уведомления
                  </label>
                </div>
              </div>

              <div className="mb-3">
                <h6 className="text-muted mb-2">Тема</h6>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="theme"
                    id="lightTheme"
                    defaultChecked
                  />
                  <label className="form-check-label" htmlFor="lightTheme">
                    Светлая
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="theme"
                    id="darkTheme"
                  />
                  <label className="form-check-label" htmlFor="darkTheme">
                    Темная
                  </label>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Закрыть
              </button>
              <button type="button" className="btn btn-primary">
                Сохранить изменения
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
