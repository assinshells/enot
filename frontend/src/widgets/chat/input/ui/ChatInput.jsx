import { useState, useCallback, useEffect } from "react";
import { MAX_MESSAGE_LENGTH } from "@/shared/config/constants";

export const ChatInput = ({
  onSendMessage,
  loading,
  recipientValue = "",
  messageValue = "",
}) => {
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");

  // Обновляем значения при изменении извне
  useEffect(() => {
    if (recipientValue) {
      setRecipient(recipientValue);
    }
  }, [recipientValue]);

  useEffect(() => {
    if (messageValue) {
      setMessage(messageValue);
    }
  }, [messageValue]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      const trimmedMessage = message.trim();
      if (!trimmedMessage || loading) return;

      const trimmedRecipient = recipient.trim();

      onSendMessage({
        text: trimmedMessage,
        recipient: trimmedRecipient || null,
      });

      setMessage("");
      // Не очищаем получателя, чтобы можно было отправить несколько сообщений подряд
    },
    [message, recipient, loading, onSendMessage]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
      }
    },
    [handleSubmit]
  );

  const handleClearRecipient = useCallback(() => {
    setRecipient("");
  }, []);

  return (
    <div className="chat-input-section p-3 border-top mb-0">
      <form onSubmit={handleSubmit}>
        {/* Поле получателя */}
        <div className="row g-2 mb-2">
          <div className="col">
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-person"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Получатель (оставьте пустым для общего чата)"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                disabled={loading}
              />
              {recipient && (
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={handleClearRecipient}
                  disabled={loading}
                >
                  <i className="bi bi-x"></i>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Поле сообщения */}
        <div className="row g-0 align-items-center">
          <div className="col">
            <input
              type="text"
              className="form-control form-control-lg bg-light border-light"
              placeholder="Введите сообщение..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              maxLength={MAX_MESSAGE_LENGTH}
            />
          </div>
          <div className="col-auto">
            <div className="chat-input-links ms-2">
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={!message.trim() || loading}
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
};
