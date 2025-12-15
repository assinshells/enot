/**
 * Shared UI: Card Component
 * Путь: src/shared/ui/Card/Card.jsx
 */
export const Card = ({ children }) => {
  return (
    <div className="card">
      <div className="card-body p-4">
        <div className="p-3">{children}</div>
      </div>
    </div>
  );
};
