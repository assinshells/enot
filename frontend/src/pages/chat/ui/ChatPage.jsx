import { useState, useCallback } from "react";
import { LeftSidebarMenu } from "@/widgets/left-sidebar-menu/ui/LeftSidebarMenu";
import { RoomSidebar } from "@/widgets/room-sidebar/ui/RoomSidebar";
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
  } = useChat();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [localError, setLocalError] = useState(error);
  const [recipientValue, setRecipientValue] = useState("");
  const [messageValue, setMessageValue] = useState("");

  const handleSendMessage = useCallback(
    async ({ text, recipient }) => {
      try {
        await sendMessage(text, recipient);
      } catch (err) {
        console.error("Ошибка отправки:", err);
      }
    },
    [sendMessage]
  );

  // Вставляет время в поле ввода как текст сообщения
  const handleTimeClick = useCallback((time) => {
    setMessageValue(time);
    // Сбрасываем после передачи
    setTimeout(() => setMessageValue(""), 0);
  }, []);

  // Подставляет никнейм как placeholder для получателя
  const handleNicknameClick = useCallback((nickname) => {
    setRecipientValue(nickname);
    // Сбрасываем после передачи
    setTimeout(() => setRecipientValue(""), 0);
  }, []);

  const handleCloseError = useCallback(() => {
    setLocalError(null);
  }, []);

  const handleOpenSettings = useCallback(() => {
    setIsSettingsOpen(true);
  }, []);

  const handleCloseSettings = useCallback(() => {
    setIsSettingsOpen(false);
  }, []);

  return (
    <>
      <div className="layout-wrapper d-lg-flex">
        <LeftSidebarMenu onOpenSettings={handleOpenSettings} />

        <div className="user-chat w-100 overflow-hidden d-flex flex-column">
          {localError && (
            <div className="p-3">
              <Alert type="danger" onClose={handleCloseError}>
                {localError}
              </Alert>
            </div>
          )}

          <div className="d-flex flex-grow-1 overflow-hidden">
            <div className="flex-grow-1 d-flex flex-column overflow-hidden">
              <div className="flex-grow-1 overflow-auto">
                <ChatMessages
                  messages={messages}
                  loading={loading}
                  onTimeClick={handleTimeClick}
                  onNicknameClick={handleNicknameClick}
                />
              </div>
              <ChatInput
                onSendMessage={handleSendMessage}
                loading={sending}
                recipientValue={recipientValue}
                messageValue={messageValue}
              />
            </div>

            <RoomSidebar
              currentRoom={currentRoom}
              onRoomChange={changeRoom}
              onUserClick={handleNicknameClick}
            />
          </div>
        </div>

        <SettingsModal isOpen={isSettingsOpen} onClose={handleCloseSettings} />
      </div>
    </>
  );
};
