import { useState, useCallback } from "react";
import { useAuth } from "@/shared/lib/hooks/useAuth";
import { userApi, authApi } from "@/entities/user";
import { ColorPicker, Modal } from "@/shared/ui";

export const ColorSelectionModal = ({ isOpen, onClose }) => {
  const { user, setUser } = useAuth();
  const [selectedColor, setSelectedColor] = useState(user?.color || "black");
  const [saving, setSaving] = useState(false);

  const handleColorChange = useCallback((color) => {
    setSelectedColor(color);
  }, []);

  const handleConfirm = useCallback(async () => {
    setSaving(true);

    try {
      await Promise.all([
        userApi.updateColor(selectedColor),
        authApi.markUserSeen(),
      ]);

      setUser((prev) => ({ ...prev, color: selectedColor, isNewUser: false }));
      onClose();
    } catch (error) {
      console.error("Ошибка при сохранении цвета:", error);
    } finally {
      setSaving(false);
    }
  }, [selectedColor, setUser, onClose]);

  const handleSkip = useCallback(async () => {
    try {
      await authApi.markUserSeen();
      setUser((prev) => ({ ...prev, isNewUser: false }));
      onClose();
    } catch (error) {
      console.error("Ошибка при пропуске выбора цвета:", error);
    }
  }, [setUser, onClose]);

  const footer = (
    <>
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
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={null}
      title={
        <>
          <i className="bi bi-palette me-2"></i>
          Добро пожаловать в чат!
        </>
      }
      footer={footer}
      closeOnBackdrop={false}
    >
      <p className="text-muted mb-3">
        Выберите цвет для вашего никнейма и сообщений
      </p>

      <ColorPicker
        value={selectedColor}
        onChange={handleColorChange}
        disabled={saving}
      />
    </Modal>
  );
};
