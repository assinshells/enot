/**
 * Page: Chat
 * Путь: src/pages/chat/ui/ChatPage.jsx
 */
import { useState } from "react";
import { LeftSidebarMenu } from "@/widgets/left-sidebar-menu/ui/LeftSidebarMenu";
import { LeftSidebarChat } from "@/widgets/left-sidebar-chat/ui/LeftSidebarChat";
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
      <div className="layout-wrapper d-lg-flex">
        <LeftSidebarMenu onOpenSettings={() => setIsSettingsOpen(true)} />
        <LeftSidebarChat />
        {error && (
          <div className="p-3">
            <Alert type="danger" onClose={() => {}}>
              {error}
            </Alert>
          </div>
        )}
        <ChatMessages messages={messages} loading={loading} />
        <ChatInput onSendMessage={handleSendMessage} loading={sending} />
        <ProfileSidebar />
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />
      </div>
    </>
  );
};
