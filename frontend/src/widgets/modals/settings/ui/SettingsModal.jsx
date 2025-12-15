import { useEffect, useState } from "react";
import { useAuth } from "@/shared/lib/hooks/useAuth";
import { userApi } from "@/entities/user";
import { ColorPicker } from "@/shared/ui";
import "./SettingsModal.css";

export const SettingsModal = ({ isOpen, onClose }) => {
  const { user, setUser } = useAuth();
  const [selectedColor, setSelectedColor] = useState(user?.color || "black");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setSelectedColor(user?.color || "black");
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, user?.color]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleColorChange = async (color) => {
    setSelectedColor(color);
    setSaving(true);
    setMessage("");

    try {
      await userApi.updateColor(color);
      setUser((prev) => ({ ...prev, color }));
      setMessage("Цвет успешно изменен!");
      setTimeout(() => setMessage(""), 2000);
    } catch (error) {
      setMessage("Ошибка при изменении цвета");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-backdrop-custom" onClick={onClose} />

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
              {message && (
                <div className="alert alert-success" role="alert">
                  {message}
                </div>
              )}

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
                <h6 className="text-muted mb-2">Цвет никнейма и сообщений</h6>
                <ColorPicker
                  value={selectedColor}
                  onChange={handleColorChange}
                  disabled={saving}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
