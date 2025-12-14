/**
 * Page: Chat
 * Путь: src/pages/chat/ui/ChatPage.jsx
 */
import { useState } from "react";
import { LeftSidebarMenu } from "@/widgets/left-sidebar-menu/ui/LeftSidebarMenu";
import { LeftSidebarChat } from "@/widgets/left-sidebar-chat/ui/LeftSidebarChat";
import { RoomSidebar } from "@/widgets/room-sidebar/ui/RoomSidebar";
import { ProfileSidebar } from "@/widgets/profile-sidebar/ui/ProfileSidebar";
import { ChatMessages } from "@/widgets/chat/messages/ui/ChatMessages";
import { ChatInput } from "@/widgets/chat/input/ui/ChatInput";
import { SettingsModal } from "@/widgets/modals/settings/ui/SettingsModal";
import { useChat } from "@/features/chat/model/useChat";
import { Alert } from "@/shared/ui";
import "./ChatPage.css";

export const ChatPage = () => {
  const {
    currentRoom,
    messages,
    loading,
    sending,
    error,
    sendMessage,
    changeRoom,
    rooms,
    counts,
  } = useChat();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [localError, setLocalError] = useState(null);
  useEffect(() => {
    setLocalError(error);
  }, [error]);

  const handleSendMessage = async (text) => {
    try {
      await sendMessage(text);
    } catch (err) {
      console.error("Ошибка отправки:", err);
    }
  };

  return (
    <>
      <div className="chat-layout">
        {/* Левое меню */}
        <LeftSidebarMenu onOpenSettings={() => setIsSettingsOpen(true)} />

        {/* Основная область чата */}
        <div className="chat-main">
          {/* Шапка с названием комнаты */}
          <div className="chat-header border-bottom p-3 d-flex justify-content-between align-items-center">
            <h5 className="mb-0 d-flex align-items-center">
              <i className="bi bi-chat-dots-fill me-2 text-primary"></i>
              <strong>{currentRoom}</strong>
            </h5>

            {/* ✅ НОВОЕ: Кнопка для мобильного селектора */}
            <button
              className="btn btn-outline-primary d-lg-none"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#roomSelectorOffcanvas"
            >
              <i className="bi bi-list"></i> Комнаты
            </button>
          </div>

          {/* Ошибки */}
          {localError && (
            <div className="p-3">
              <Alert type="danger" onClose={() => setLocalError(null)}>
                {localError}
              </Alert>
            </div>
          )}

          {/* Сообщения */}
          <ChatMessages messages={messages} loading={loading} />

          {/* Поле ввода */}
          <ChatInput onSendMessage={handleSendMessage} loading={sending} />
        </div>

        {/* Правый сайдбар с комнатами (Desktop) */}
        <RoomSidebar currentRoom={currentRoom} onRoomChange={changeRoom} />
      </div>

      {/* Модалка настроек */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
};
