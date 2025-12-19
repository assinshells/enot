/**
 * Shared UI: Input Component
 * Путь: src/shared/ui/Input/Input.jsx
 */
export const Input = ({
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  error,
  helperText,
  required = false,
  disabled = false,
  className = "form-control",
  ...props
}) => {
  const inputClass = `form-control ${error ? "is-invalid" : ""} ${className}`;
  return (
    <>
      <input
        type={type}
        name={name}
        className={inputClass}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        {...props}
      />
      {helperText && !error && (
        <small className="text-muted d-block mt-1">{helperText}</small>
      )}
      {error && <div className="invalid-feedback d-block">{error}</div>}
    </>
  );
};
