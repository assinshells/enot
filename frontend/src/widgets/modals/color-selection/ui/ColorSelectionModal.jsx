import { useState, useEffect } from "react";
import { useAuth } from "@/shared/lib/hooks/useAuth";
import { userApi, authApi } from "@/entities/user";
import { ColorPicker } from "@/shared/ui";
import "./ColorSelectionModal.css";

export const ColorSelectionModal = ({ isOpen, onClose }) => {
  const { user, setUser } = useAuth();
  const [selectedColor, setSelectedColor] = useState(user?.color || "black");
  const [saving, setSaving] = useState(false);

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

  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  const handleConfirm = async () => {
    setSaving(true);

    try {
      await userApi.updateColor(selectedColor);
      await authApi.markUserSeen();
      setUser((prev) => ({ ...prev, color: selectedColor, isNewUser: false }));
      onClose();
    } catch (error) {
      console.error("Ошибка при сохранении цвета:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = async () => {
    try {
      await authApi.markUserSeen();
      setUser((prev) => ({ ...prev, isNewUser: false }));
      onClose();
    } catch (error) {
      console.error("Ошибка при пропуске выбора цвета:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-backdrop-custom" />

      <div className="modal-custom">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header border-bottom-0">
              <h5 className="modal-title">
                <i className="bi bi-palette me-2"></i>
                Добро пожаловать в чат!
              </h5>
            </div>
            <div className="modal-body">
              <p className="text-muted mb-3">
                Выберите цвет для вашего никнейма и сообщений
              </p>

              <ColorPicker
                value={selectedColor}
                onChange={handleColorChange}
                disabled={saving}
              />
            </div>
            <div className="modal-footer border-top-0">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleSkip}
                disabled={saving}
              >
                Пропустить
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleConfirm}
                disabled={saving}
              >
                {saving ? "Сохранение..." : "Подтвердить"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
