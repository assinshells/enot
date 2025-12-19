import { useState, useCallback, memo } from "react";
import { useAuth } from "@/shared/lib/hooks/useAuth";
import { userApi } from "@/entities/user";
import { ColorPicker, GenderPicker, Modal } from "@/shared/ui";

const ProfileInfo = memo(({ user }) => (
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
          <strong>ID:</strong> <code className="text-break">{user?._id}</code>
        </p>
      </div>
    </div>
  </div>
));

ProfileInfo.displayName = "ProfileInfo";

export const SettingsModal = memo(({ isOpen, onClose }) => {
  const { user, setUser } = useAuth();
  const [selectedColor, setSelectedColor] = useState(user?.color || "black");
  const [selectedGender, setSelectedGender] = useState(
    user?.gender || "unknown"
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const updateProfile = useCallback(
    async (data, successMsg) => {
      setSaving(true);
      setMessage("");

      try {
        await userApi.updateProfile(data);
        setUser((prev) => ({ ...prev, ...data }));
        setMessage(successMsg);
        setTimeout(() => setMessage(""), 2000);
      } catch (error) {
        setMessage("Ошибка при обновлении");
      } finally {
        setSaving(false);
      }
    },
    [setUser]
  );

  const handleColorChange = useCallback(
    async (color) => {
      setSelectedColor(color);
      await updateProfile({ color }, "Цвет успешно изменен!");
    },
    [updateProfile]
  );

  const handleGenderChange = useCallback(
    async (gender) => {
      setSelectedGender(gender);
      await updateProfile({ gender }, "Пол успешно изменен!");
    },
    [updateProfile]
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

      <ProfileInfo user={user} />

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
});

SettingsModal.displayName = "SettingsModal";
