import { useState, useCallback } from "react";
import { useAuth } from "@/shared/lib/hooks/useAuth";
import { userApi } from "@/entities/user";
import { ColorPicker, GenderPicker, Modal } from "@/shared/ui";

export const SettingsModal = ({ isOpen, onClose }) => {
  const { user, setUser } = useAuth();
  const [selectedColor, setSelectedColor] = useState(user?.color || "black");
  const [selectedGender, setSelectedGender] = useState(
    user?.gender || "unknown"
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleColorChange = useCallback(
    async (color) => {
      setSelectedColor(color);
      setSaving(true);
      setMessage("");

      try {
        await userApi.updateProfile({ color });
        setUser((prev) => ({ ...prev, color }));
        setMessage("Цвет успешно изменен!");
        setTimeout(() => setMessage(""), 2000);
      } catch (error) {
        setMessage("Ошибка при изменении цвета");
      } finally {
        setSaving(false);
      }
    },
    [setUser]
  );

  const handleGenderChange = useCallback(
    async (gender) => {
      setSelectedGender(gender);
      setSaving(true);
      setMessage("");

      try {
        await userApi.updateProfile({ gender });
        setUser((prev) => ({ ...prev, gender }));
        setMessage("Пол успешно изменен!");
        setTimeout(() => setMessage(""), 2000);
      } catch (error) {
        setMessage("Ошибка при изменении пола");
      } finally {
        setSaving(false);
      }
    },
    [setUser]
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <>
          <i className="bi bi-gear me-2"></i>
          Настройки
        </>
      }
    >
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

      <div className="mb-3">
        <h6 className="text-muted mb-2">Пол</h6>
        <GenderPicker
          value={selectedGender}
          onChange={handleGenderChange}
          disabled={saving}
        />
      </div>
    </Modal>
  );
};
