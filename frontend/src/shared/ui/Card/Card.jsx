/**
 * Shared UI: Card Component
 * Путь: src/shared/ui/Card/Card.jsx
 */
export const Card = ({ children }) => {
  return (
    <div className="card">
      <div className="card-body p-4">{children}</div>
    </div>
  );
};
