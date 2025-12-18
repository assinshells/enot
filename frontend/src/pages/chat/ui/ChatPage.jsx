import { useState, useCallback } from "react";
import { LeftSidebarMenu } from "@/widgets/left-sidebar-menu/ui/LeftSidebarMenu";
import { LeftSidebarChat } from "@/widgets/left-sidebar-chat/ui/LeftSidebarChat";
import { ChatHead } from "@/widgets/chat/head/ui/ChatHead";
import { ChatMessages } from "@/widgets/chat/messages/ui/ChatMessages";
import { ChatInput } from "@/widgets/chat/input/ui/ChatInput";
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

  const handleTimeClick = useCallback((time) => {
    setMessageValue(time);
    setTimeout(() => setMessageValue(""), 0);
  }, []);

  const handleNicknameClick = useCallback((nickname) => {
    setRecipientValue(nickname);
    setTimeout(() => setRecipientValue(""), 0);
  }, []);

  const handleRoomClick = useCallback(
    (roomName) => {
      changeRoom(roomName);
    },
    [changeRoom]
  );

  return (
    <>
      {/* start layout wrapper */}
      <div className="layout-wrapper d-lg-flex">
        <LeftSidebarMenu />
        <LeftSidebarChat
          currentRoom={currentRoom}
          onRoomChange={changeRoom}
          onUserClick={handleNicknameClick}
        />

        {/* start user chat */}
        <div className="user-chat w-100 overflow-hidden">
          <div className="d-lg-flex">
            <div className="w-100 overflow-hidden position-relative">
              {error && (
                <div className="p-3">
                  <Alert type="danger" onClose={() => {}}>
                    {error}
                  </Alert>
                </div>
              )}
              <ChatHead />
              <div className="d-flex flex-grow-1 overflow-hidden">
                <div className="flex-grow-1 d-flex flex-column overflow-hidden">
                  <div className="flex-grow-1 overflow-auto">
                    <ChatMessages
                      messages={messages}
                      loading={loading}
                      onTimeClick={handleTimeClick}
                      onNicknameClick={handleNicknameClick}
                      onRoomClick={handleRoomClick}
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
        {/* end user chat */}
      </div>
      {/* end layout wrapper */}
    </>
  );
};
