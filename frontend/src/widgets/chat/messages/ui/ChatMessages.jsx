import { useEffect, useRef, memo } from "react";
import { formatTime } from "@/shared/lib/utils/formatTime";
import { getColorValue } from "@/shared/config/colors";
import { SYSTEM_MESSAGE_TYPE } from "@/shared/config/systemMessages";
import { parseSystemMessage } from "@/features/chat/utils/systemMessageFormatter";
import "./ChatMessages.css";

const TIME_COLOR = "#6c757d";
const MY_MESSAGE_COLOR = "#dc3545";

const SystemMessageItem = memo(
  ({
    message,
    onTimeClick,
    onNicknameClick,
    onRoomClick,
    currentUserNickname,
  }) => {
    const parts = parseSystemMessage(
      message,
      currentUserNickname,
      onNicknameClick,
      onRoomClick
    );

    return (
      <li>
        <span
          className="message-time clickable me-2"
          onClick={() => onTimeClick(formatTime(message.createdAt))}
          style={{ color: TIME_COLOR, cursor: "pointer", fontSize: "0.85em" }}
        >
          {formatTime(message.createdAt)}
        </span>
        <span className="system-message-content">
          {parts.map((part, index) => (
            <span
              key={index}
              style={{
                color: part.color,
                cursor: part.clickable ? "pointer" : "default",
                fontWeight: part.clickable ? "500" : "normal",
              }}
              onClick={part.onClick}
            >
              {part.text}
            </span>
          ))}
        </span>
      </li>
    );
  }
);

SystemMessageItem.displayName = "SystemMessageItem";

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

    const senderColor = isMyMessage ? MY_MESSAGE_COLOR : TIME_COLOR;
    const recipientColor = isToMe
      ? MY_MESSAGE_COLOR
      : getColorValue(message.userColor);
    const messageColor = getColorValue(message.userColor);

    return (
      <li className="message-item">
        <span
          className="message-time clickable"
          onClick={() => onTimeClick(formatTime(message.createdAt))}
          style={{ color: TIME_COLOR, cursor: "pointer" }}
        >
          {formatTime(message.createdAt)}
        </span>{" "}
        <span
          className={`message-sender ${!isMyMessage ? "clickable" : ""}`}
          onClick={() => !isMyMessage && onNicknameClick(message.nickname)}
          style={{
            color: senderColor,
            cursor: isMyMessage ? "default" : "pointer",
          }}
        >
          {message.nickname}
        </span>
        {message.recipient && (
          <>
            {" "}
            <span
              className="message-recipient"
              style={{ color: recipientColor }}
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
  ({
    messages,
    loading,
    onTimeClick,
    onNicknameClick,
    onRoomClick,
    currentUserId,
    currentUserNickname,
  }) => {
    const messagesEndRef = useRef(null);

    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    if (loading) return <LoadingSpinner />;
    if (!messages || messages.length === 0) return <EmptyState />;

    return (
      <div className="chat-conversation p-3 p-lg-4">
        <ul className="list-unstyled mb-0">
          {messages.map((message) =>
            message.type === SYSTEM_MESSAGE_TYPE ? (
              <SystemMessageItem
                key={message._id}
                message={message}
                onTimeClick={onTimeClick}
                onNicknameClick={onNicknameClick}
                onRoomClick={onRoomClick}
                currentUserNickname={currentUserNickname}
              />
            ) : (
              <MessageItem
                key={message._id}
                message={message}
                onTimeClick={onTimeClick}
                onNicknameClick={onNicknameClick}
                currentUserId={currentUserId}
                currentUserNickname={currentUserNickname}
              />
            )
          )}
        </ul>
        <div ref={messagesEndRef} />
      </div>
    );
  }
);

ChatMessages.displayName = "ChatMessages";
