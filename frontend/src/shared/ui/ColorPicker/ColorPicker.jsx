/**
 * Shared UI: ColorPicker Component
 * Путь: frontend/src/shared/ui/ColorPicker/ColorPicker.jsx
 */
import { COLOR_OPTIONS } from "@/shared/config/colors";

export const ColorPicker = ({ value, onChange, disabled = false }) => {
  return (
    <div className="d-flex gap-2">
      {COLOR_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`btn ${
            value === option.value ? "btn-primary" : "btn-outline-secondary"
          }`}
          style={{
            flex: 1,
            backgroundColor:
              value === option.value ? option.color : "transparent",
            borderColor: option.color,
            color: value === option.value ? "#fff" : option.color,
          }}
          onClick={() => onChange(option.value)}
          disabled={disabled}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};
