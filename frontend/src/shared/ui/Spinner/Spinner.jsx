/**
 * Shared UI: Spinner Component
 * Путь: src/shared/ui/Spinner/Spinner.jsx
 */
export const Spinner = ({
  size = "md",
  fullScreen = false,
  text = "Загрузка...",
}) => {
  const spinnerSize = size === "sm" ? "spinner-border-sm" : "";

  const spinner = (
    <div className={`spinner-border text-primary ${spinnerSize}`} role="status">
      <span className="visually-hidden">{text}</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        {spinner}
      </div>
    );
  }

  return spinner;
};
