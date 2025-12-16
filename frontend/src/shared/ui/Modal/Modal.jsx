/**
 * Shared UI: Modal Component
 * Путь: src/shared/ui/Modal/Modal.jsx
 */
import { useEffect } from "react";

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  closeOnBackdrop = true,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen && onClose) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = () => {
    if (closeOnBackdrop && onClose) {
      onClose();
    }
  };

  return (
    <>
      <div className="modal-backdrop-custom" onClick={handleBackdropClick} />

      <div className="modal-custom">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            {title && (
              <div className="modal-header">
                <h5 className="modal-title">{title}</h5>
                {onClose && (
                  <button
                    type="button"
                    className="btn-close"
                    onClick={onClose}
                    aria-label="Close"
                  />
                )}
              </div>
            )}
            <div className="modal-body">{children}</div>
            {footer && (
              <div className="modal-footer border-top-0">{footer}</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
