import { GENDER_OPTIONS } from "@/shared/config/constants";

export const GenderPicker = ({ value, onChange, disabled = false }) => {
  return (
    <div className="d-flex gap-2">
      {GENDER_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`btn ${
            value === option.value ? "btn-primary" : "btn-outline-secondary"
          }`}
          style={{ flex: 1 }}
          onClick={() => onChange(option.value)}
          disabled={disabled}
        >
          <i className={`${option.icon} me-2`}></i>
          {option.label}
        </button>
      ))}
    </div>
  );
};
