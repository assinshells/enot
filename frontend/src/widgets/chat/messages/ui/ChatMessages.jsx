import { useEffect, useRef, memo } from "react";
import { formatTime } from "@/shared/lib/utils/formatTime";
import { useAuth } from "@/shared/lib/hooks/useAuth";
import "./ChatMessages.css";

const MessageItem = memo(({ message, isOwn }) => (
  <li className={isOwn ? "right" : "left"}>
    <div className="conversation-list">
      <div className="ctext-wrap">
        <div className="ctext-wrap-content">
          <span className="chat-time">{formatTime(message.createdAt)}</span>
          <span className="conversation-name">{message.nickname}</span>
          <span className="conversation-text">{message.text}</span>
        </div>
      </div>
    </div>
  </li>
));

MessageItem.displayName = "MessageItem";

export const ChatMessages = ({ messages, loading }) => {
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (loading) {
    return (
      <div className="chat-messages-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="chat-messages-empty">
        <p className="text-muted">Нет сообщений. Начните общение!</p>
      </div>
    );
  }

  return (
    <div className="chat-messages">
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
};
