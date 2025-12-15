import { useEffect, useRef, memo, useMemo } from "react";
import { formatTime } from "@/shared/lib/utils/formatTime";
import { useAuth } from "@/shared/lib/hooks/useAuth";
import "./ChatMessages.css";

const COLOR_MAP = {
  black: "#000000",
  blue: "#0d6efd",
  green: "#198754",
  orange: "#fd7e14",
};

const MessageItem = memo(({ message, isOwn }) => {
  const nicknameColor = COLOR_MAP[message.userColor] || COLOR_MAP.black;

  return (
    <li className={isOwn ? "right" : "left"}>
      <div className="conversation-list">
        <div className="ctext-wrap">
          <div className="ctext-wrap-content">
            <span className="chat-time">{formatTime(message.createdAt)}</span>
            <span
              className="conversation-name"
              style={{ color: nicknameColor, fontWeight: "600" }}
            >
              {message.nickname}
            </span>
            <span className="conversation-text">{message.text}</span>
          </div>
        </div>
      </div>
    </li>
  );
});

MessageItem.displayName = "MessageItem";

const LoadingSpinner = () => (
  <div className="d-flex justify-content-center align-items-center h-100">
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Загрузка...</span>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="d-flex justify-content-center align-items-center h-100">
    <p className="text-muted">Нет сообщений. Начните общение!</p>
  </div>
);

export const ChatMessages = ({ messages, loading }) => {
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  const messageList = useMemo(() => {
    if (!messages || messages.length === 0) return [];
    return messages.map((message) => ({
      ...message,
      isOwn: message.user === user?._id,
    }));
  }, [messages, user?._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageList]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (messageList.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="chat-messages p-3">
      <ul className="chat-conversation list-unstyled mb-0">
        {messageList.map((message) => (
          <MessageItem
            key={message._id}
            message={message}
            isOwn={message.isOwn}
          />
        ))}
      </ul>
      <div ref={messagesEndRef} />
    </div>
  );
};
