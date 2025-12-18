import { useState, useCallback, useEffect, useRef } from "react";
import { MAX_MESSAGE_LENGTH } from "@/shared/config/constants";

export const ChatInput = ({
  onSendMessage,
  loading,
  recipientValue = "",
  messageValue = "",
}) => {
  const [message, setMessage] = useState("");
  const [recipientPlaceholder, setRecipientPlaceholder] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (recipientValue) {
      setRecipientPlaceholder(recipientValue);
    }
  }, [recipientValue]);

  useEffect(() => {
    if (messageValue && inputRef.current) {
      const input = inputRef.current;
      const start = input.selectionStart || 0;
      const end = input.selectionEnd || 0;
      const currentText = message;

      const newText =
        currentText.substring(0, start) +
        messageValue +
        currentText.substring(end);

      setMessage(newText);

      requestAnimationFrame(() => {
        const newCursorPos = start + messageValue.length;
        input.setSelectionRange(newCursorPos, newCursorPos);
        input.focus();
      });
    }
  }, [messageValue, message]);

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
    setRecipientPlaceholder("");
  }, []);

  const inputPlaceholder = recipientPlaceholder
    ? `Сообщение для ${recipientPlaceholder}...`
    : "Введите сообщение...";

  return (
    <div className="chat-input-section p-3 p-lg-4 border-top mb-0">
      <form onSubmit={handleSubmit}>
        <div className="row g-0">
          <div className="col">
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
            {recipientPlaceholder && (
              <button
                type="button"
                className="btn btn-sm btn-link position-absolute top-50 end-0 translate-middle-y text-danger"
                onClick={handleClearRecipient}
                disabled={loading}
                title="Очистить получателя"
              >
                <i className="bi bi-x-circle-fill"></i>
              </button>
            )}
          </div>
          <div className="col-auto">
            <div className="chat-input-links ms-md-2 me-md-0">
              <ul class="list-inline mb-0">
                <li class="list-inline-item">
                  <button
                    type="submit"
                    className="btn btn-primary font-size-16 btn-lg chat-send"
                    disabled={!message.trim() || loading}
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm" />
                    ) : (
                      <i className="bi bi-send-fill"></i>
                    )}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
