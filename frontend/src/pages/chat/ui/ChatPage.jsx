/**
 * Page: Chat (ОБНОВЛЕНО С ВИДЖЕТАМИ)
 * Путь: src/pages/chat/ui/ChatPage.jsx
 */
import { useState } from "react";
import { Sidebar } from "@/widgets/sidebar/ui/Sidebar";
import { ProfileSidebar } from "@/widgets/profile-sidebar/ui/ProfileSidebar";
import { ChatMessages } from "@/widgets/chat/messages/ui/ChatMessages";
import { ChatInput } from "@/widgets/chat/input/ui/ChatInput";
import { SettingsModal } from "@/widgets/modals/settings/ui/SettingsModal";
import { useChat } from "@/features/chat/model/useChat";
import { Alert } from "@/shared/ui";

export const ChatPage = () => {
  const { messages, loading, sending, error, sendMessage } = useChat();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleSendMessage = async (text) => {
    try {
      await sendMessage(text);
    } catch (err) {
      console.error("Ошибка отправки:", err);
    }
  };

  return (
    <>
      {/* Mobile кнопка для профиля */}
      <div className="d-md-none p-2 border-bottom">
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          data-bs-toggle="offcanvas"
          data-bs-target="#profileSidebar"
        >
          <i className="bi bi-person me-2"></i>
          Профиль
        </button>
      </div>

      <div className="layout-wrapper d-lg-flex">
        {/* Левый сайдбар */}
        <Sidebar onOpenSettings={() => setIsSettingsOpen(true)} />

        {/* Основной контент - чат */}
        <div className="user-chat w-100 overflow-hidden">
          <div className="d-lg-flex flex-column h-100">
            {/* Сообщения об ошибках */}
            {error && (
              <div className="p-3">
                <Alert type="danger" onClose={() => {}}>
                  {error}
                </Alert>
              </div>
            )}

            {/* Список сообщений */}
            <ChatMessages messages={messages} loading={loading} />

            {/* Форма ввода */}
            <ChatInput onSendMessage={handleSendMessage} loading={sending} />
          </div>
        </div>

        {/* Правый сайдбар - профиль */}
        <ProfileSidebar />
      </div>

      {/* Модальное окно настроек */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
};
