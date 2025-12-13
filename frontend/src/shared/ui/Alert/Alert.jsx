/**
 * Shared UI: Alert Component
 * Путь: src/shared/ui/Alert/Alert.jsx
 */
export const Alert = ({ children, type = "info", onClose, className = "" }) => {
  const alertClass = `alert alert-${type} ${
    onClose ? "alert-dismissible fade show" : ""
  } ${className}`;

  return (
    <div className={alertClass} role="alert">
      {children}
      {onClose && (
        <button
          type="button"
          className="btn-close"
          onClick={onClose}
          aria-label="Close"
        ></button>
      )}
    </div>
  );
};
