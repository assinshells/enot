import { useState, useCallback, memo } from "react";
import { LeftSidebarMenu } from "@/widgets/left-sidebar-menu/ui/LeftSidebarMenu";
import { RightSidebarChat } from "@/widgets/right-sidebar-chat/ui/RightSidebarChat";
import { ChatMessages } from "@/widgets/chat/messages/ui/ChatMessages";
import { ChatInput } from "@/widgets/chat/input/ui/ChatInput";
import { SettingsModal } from "@/widgets/modals/settings/ui/SettingsModal";
import { useChat } from "@/features/chat/model/useChat";
import { useAuth } from "@/shared/lib/hooks/useAuth";
import { useRooms, useSocketConnection } from "@/shared/lib/hooks";
import { Alert } from "@/shared/ui";
import "./ChatPage.css";

const ChatHeader = memo(() => (
  <div className="p-3 p-lg-4 border-bottom user-chat-topbar">
    <div className="row align-items-center">
      <div className="col-sm-4 col-8">
        <div className="d-flex align-items-center">
          <div className="flex-grow-1 overflow-hidden">
            <h5 className="font-size-16 mb-0 text-truncate">Chat</h5>
          </div>
        </div>
      </div>
    </div>
  </div>
));

ChatHeader.displayName = "ChatHeader";

export const ChatPage = () => {
  const { user } = useAuth();
  const { currentRoom } = useRooms();
  const isConnected = useSocketConnection();
  const { messages, loading, sending, error, sendMessage } =
    useChat(currentRoom);

  const [recipientValue, setRecipientValue] = useState("");
  const [messageValue, setMessageValue] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);

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

  const handleTimeClick = useCallback((time) => {
    setMessageValue(time);
    setTimeout(() => setMessageValue(""), 0);
  }, []);

  const handleNicknameClick = useCallback((nickname) => {
    setRecipientValue(nickname);
    setTimeout(() => setRecipientValue(""), 0);
  }, []);

  if (!isConnected) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Подключение...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="layout-wrapper d-lg-flex">
        <LeftSidebarMenu onOpenSettings={() => setSettingsOpen(true)} />

        <div className="user-chat w-100 overflow-hidden">
          <div className="d-lg-flex">
            <div className="w-100 overflow-hidden position-relative">
              {error && (
                <div className="p-3">
                  <Alert type="danger">{error}</Alert>
                </div>
              )}
              <ChatHeader />
              <div className="d-flex flex-grow-1 overflow-hidden">
                <div className="flex-grow-1 d-flex flex-column overflow-hidden">
                  <div className="flex-grow-1 overflow-auto">
                    <ChatMessages
                      messages={messages}
                      loading={loading}
                      onTimeClick={handleTimeClick}
                      onNicknameClick={handleNicknameClick}
                      currentUserId={user?._id}
                      currentUserNickname={user?.nickname}
                    />
                  </div>
                  <ChatInput
                    onSendMessage={handleSendMessage}
                    loading={sending}
                    recipientValue={recipientValue}
                    messageValue={messageValue}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <RightSidebarChat onUserClick={handleNicknameClick} />

        <SettingsModal
          isOpen={settingsOpen}
          onClose={() => setSettingsOpen(false)}
        />
      </div>
    </>
  );
};
