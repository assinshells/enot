/**
 * Widget: Chat Input
 * Путь: src/widgets/chat/input/ui/ChatInput.jsx
 */
import { useState } from "react";

export const ChatInput = ({ onSendMessage, loading }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmed = message.trim();
    if (!trimmed || loading) return;

    onSendMessage(trimmed);
    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="chat-input-section p-3 p-lg-4 border-top mb-0">
      <form onSubmit={handleSubmit}>
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
              maxLength={1000}
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
