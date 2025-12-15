import { useState, useEffect, useCallback } from "react";
import { LeftSidebarMenu } from "@/widgets/left-sidebar-menu/ui/LeftSidebarMenu";
import { RoomSidebar } from "@/widgets/room-sidebar/ui/RoomSidebar";
import { ChatMessages } from "@/widgets/chat/messages/ui/ChatMessages";
import { ChatInput } from "@/widgets/chat/input/ui/ChatInput";
import { SettingsModal } from "@/widgets/modals/settings/ui/SettingsModal";
import { ColorSelectionModal } from "@/widgets/modals/color-selection/ui/ColorSelectionModal";
import { useChat } from "@/features/chat/model/useChat";
import { useAuth } from "@/shared/lib/hooks/useAuth";
import { Alert } from "@/shared/ui";
import "./ChatPage.css";

export const ChatPage = () => {
  const { user } = useAuth();
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
  const [isColorSelectionOpen, setIsColorSelectionOpen] = useState(false);
  const [localError, setLocalError] = useState(null);

  // Показываем ColorSelectionModal для новых пользователей
  useEffect(() => {
    if (user?.isNewUser) {
      setIsColorSelectionOpen(true);
    }
  }, [user?.isNewUser]);

  useEffect(() => {
    setLocalError(error);
  }, [error]);

  const handleSendMessage = useCallback(
    async (text) => {
      try {
        await sendMessage(text);
      } catch (err) {
        console.error("Ошибка отправки:", err);
      }
    },
    [sendMessage]
  );

  const handleCloseError = useCallback(() => {
    setLocalError(null);
  }, []);

  const handleOpenSettings = useCallback(() => {
    setIsSettingsOpen(true);
  }, []);

  const handleCloseSettings = useCallback(() => {
    setIsSettingsOpen(false);
  }, []);

  const handleCloseColorSelection = useCallback(() => {
    setIsColorSelectionOpen(false);
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
                <ChatMessages messages={messages} loading={loading} />
              </div>
              <ChatInput onSendMessage={handleSendMessage} loading={sending} />
            </div>

            <RoomSidebar currentRoom={currentRoom} onRoomChange={changeRoom} />
          </div>
        </div>

        <SettingsModal isOpen={isSettingsOpen} onClose={handleCloseSettings} />
        <ColorSelectionModal
          isOpen={isColorSelectionOpen}
          onClose={handleCloseColorSelection}
        />
      </div>
    </>
  );
};
