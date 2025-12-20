/**
 * Optimized ChatInput with React.memo
 * Путь: frontend/src/widgets/chat/input/ui/ChatInput.jsx
 */
import { useState, useCallback, useEffect, useRef, useMemo, memo } from "react";
import { MAX_MESSAGE_LENGTH } from "@/shared/config/constants";
import "./ChatInput.css";

export const ChatInput = memo(
  ({ onSendMessage, loading, recipientValue = "", messageValue = "" }) => {
    const [message, setMessage] = useState("");
    const [recipientPlaceholder, setRecipientPlaceholder] = useState("");
    const inputRef = useRef(null);

    // Обробка recipientValue
    useEffect(() => {
      if (recipientValue) {
        setRecipientPlaceholder(recipientValue);
      }
    }, [recipientValue]);

    // Обробка messageValue (вставка часу)
    useEffect(() => {
      if (messageValue && inputRef.current) {
        const input = inputRef.current;
        const start = input.selectionStart || 0;
        const end = input.selectionEnd || 0;

        const newText =
          message.substring(0, start) + messageValue + message.substring(end);
        setMessage(newText);

        requestAnimationFrame(() => {
          const newCursorPos = start + messageValue.length;
          input.setSelectionRange(newCursorPos, newCursorPos);
          input.focus();
        });
      }
    }, [messageValue, message]);

    // Відправка повідомлення
    const handleSubmit = useCallback(
      (e) => {
        e.preventDefault();

        const trimmedMessage = message.trim();
        if (!trimmedMessage || loading) return;

        onSendMessage({
          text: trimmedMessage,
          recipient: recipientPlaceholder || null,
        });

        setMessage("");
        setRecipientPlaceholder("");
      },
      [message, recipientPlaceholder, loading, onSendMessage]
    );

    // Enter для відправки
    const handleKeyDown = useCallback(
      (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          handleSubmit(e);
        }
      },
      [handleSubmit]
    );

    // Очистити отримувача
    const handleClearRecipient = useCallback(() => {
      setRecipientPlaceholder("");
    }, []);

    // Мемоізований placeholder
    const inputPlaceholder = useMemo(
      () =>
        recipientPlaceholder
          ? `Сообщение для ${recipientPlaceholder}...`
          : "Введите сообщение...",
      [recipientPlaceholder]
    );

    // Мемоізована перевірка кнопки
    const isSubmitDisabled = useMemo(
      () => !message.trim() || loading,
      [message, loading]
    );

    // Мемоізований лічильник символів
    const characterCount = useMemo(
      () => `${message.length}/${MAX_MESSAGE_LENGTH}`,
      [message.length]
    );

    // Мемоізована перевірка близькості до ліміту
    const isNearLimit = useMemo(
      () => message.length > MAX_MESSAGE_LENGTH * 0.9,
      [message.length]
    );

    return (
      <div className="chat-input-section p-3 p-lg-4 border-top mb-0">
        <form onSubmit={handleSubmit}>
          <div className="row g-0 align-items-center">
            <div className="col position-relative">
              <input
                ref={inputRef}
                type="text"
                className="form-control form-control-lg bg-light border-light"
                placeholder={inputPlaceholder}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                maxLength={MAX_MESSAGE_LENGTH}
              />

              {/* Кнопка очищення отримувача */}
              {recipientPlaceholder && (
                <button
                  type="button"
                  className="btn btn-sm btn-link position-absolute top-50 end-0 translate-middle-y text-danger pe-3"
                  onClick={handleClearRecipient}
                  disabled={loading}
                  title="Очистить получателя"
                  style={{ zIndex: 10 }}
                >
                  <i className="bi bi-x-circle-fill"></i>
                </button>
              )}

              {/* Лічильник символів */}
              {message.length > 0 && (
                <small
                  className={`position-absolute bottom-0 end-0 pe-2 pb-1 ${
                    isNearLimit ? "text-danger" : "text-muted"
                  }`}
                  style={{ fontSize: "0.7rem" }}
                >
                  {characterCount}
                </small>
              )}
            </div>

            <div className="col-auto">
              <div className="chat-input-links ms-2">
                <button
                  type="submit"
                  className="btn btn-primary font-size-16 btn-lg chat-send"
                  disabled={isSubmitDisabled}
                  title="Отправить (Enter)"
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm" />
                  ) : (
                    <i className="bi bi-send-fill"></i>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
);

ChatInput.displayName = "ChatInput";
