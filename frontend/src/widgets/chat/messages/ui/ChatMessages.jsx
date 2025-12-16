import { useEffect, useRef, memo } from "react";
import { formatTime } from "@/shared/lib/utils/formatTime";
import { useAuth } from "@/shared/lib/hooks/useAuth";
import { getColorValue } from "@/shared/config/colors";
import "./ChatMessages.css";

const MessageItem = memo(
  ({
    message,
    onTimeClick,
    onNicknameClick,
    currentUserId,
    currentUserNickname,
  }) => {
    const isMyMessage = message.user === currentUserId;
    const isToMe = message.recipient === currentUserNickname;

    // Цвета
    const timeColor = "#6c757d"; // По умолчанию серый
    const senderColor = isMyMessage ? "#dc3545" : "#6c757d"; // Красный если я, иначе серый
    const recipientColor = isToMe
      ? "#dc3545"
      : getColorValue(message.userColor); // Красный если мне, иначе цвет отправителя
    const messageColor = getColorValue(message.userColor); // Цвет сообщения = цвет отправителя

    const handleTimeClick = (e) => {
      e.preventDefault();
      onTimeClick(formatTime(message.createdAt));
    };

    const handleSenderClick = (e) => {
      e.preventDefault();
      if (!isMyMessage) {
        onNicknameClick(message.nickname);
      }
    };

    return (
      <li className="message-item">
        <span
          className="message-time clickable"
          onClick={handleTimeClick}
          style={{ color: timeColor, cursor: "pointer" }}
        >
          [{formatTime(message.createdAt)}]
        </span>{" "}
        <span
          className={`message-sender ${!isMyMessage ? "clickable" : ""}`}
          onClick={handleSenderClick}
          style={{
            color: senderColor,
            cursor: isMyMessage ? "default" : "pointer",
          }}
        >
          {message.nickname}
        </span>
        {message.recipient && (
          <>
            {" → "}
            <span
              className="message-recipient"
              style={{
                color: recipientColor,
                cursor: "default",
              }}
            >
              {message.recipient}
            </span>
          </>
        )}
        {" : "}
        <span className="message-text" style={{ color: messageColor }}>
          {message.text}
        </span>
      </li>
    );
  }
);

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

export const ChatMessages = memo(
  ({ messages, loading, onTimeClick, onNicknameClick }) => {
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
        <ul className="message-list list-unstyled mb-0">
          {messages.map((message) => (
            <MessageItem
              key={message._id}
              message={message}
              onTimeClick={onTimeClick}
              onNicknameClick={onNicknameClick}
              currentUserId={user?._id}
              currentUserNickname={user?.nickname}
            />
          ))}
        </ul>
        <div ref={messagesEndRef} />
      </div>
    );
  }
);

ChatMessages.displayName = "ChatMessages";
