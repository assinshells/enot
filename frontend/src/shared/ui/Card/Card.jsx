/**
 * Shared UI: Card Component
 * Путь: src/shared/ui/Card/Card.jsx
 */
export const Card = ({ children }) => {
  return (
    <div className="card auth-card p-4 shadow-sm mb-2">
      <div className="card-body">{children}</div>
    </div>
  );
};
