import { useEffect, useRef, memo } from "react";
import { formatTime } from "@/shared/lib/utils/formatTime";
import { useAuth } from "@/shared/lib/hooks/useAuth";
import { getColorValue } from "@/shared/config/colors";
import "./ChatMessages.css";

const MessageItem = memo(({ message, isOwn }) => {
  const messageColor = getColorValue(message.userColor);

  return (
    <li className={isOwn ? "right" : "left"}>
      <div className="conversation-list">
        <div className="ctext-wrap">
          <div className="ctext-wrap-content">
            <span className="chat-time">{formatTime(message.createdAt)}</span>
            <span className="conversation-name">{message.nickname}</span>
            <span className="conversation-text" style={{ color: messageColor }}>
              {message.text}
            </span>
          </div>
        </div>
      </div>
    </li>
  );
});

MessageItem.displayName = "MessageItem";

const LoadingSpinner = memo(() => (
  <div className="d-flex justify-content-center align-items-center h-100">
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Загрузка...</span>
    </div>
  </div>
));

LoadingSpinner.displayName = "LoadingSpinner";

const EmptyState = memo(() => (
  <div className="d-flex justify-content-center align-items-center h-100">
    <p className="text-muted">Нет сообщений. Начните общение!</p>
  </div>
));

EmptyState.displayName = "EmptyState";

export const ChatMessages = memo(({ messages, loading }) => {
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!messages || messages.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="chat-messages p-3">
      <ul className="chat-conversation list-unstyled mb-0">
        {messages.map((message) => (
          <MessageItem
            key={message._id}
            message={message}
            isOwn={message.user === user?._id}
          />
        ))}
      </ul>
      <div ref={messagesEndRef} />
    </div>
  );
});

ChatMessages.displayName = "ChatMessages";
