/**
 * Shared UI: Card Component
 * Путь: src/shared/ui/Card/Card.jsx
 */
export const Card = ({ children }) => {
  return (
    <div className="card">
      <div className="p-4 card-body">
        <div className="p-4 card-body">{children}</div>
      </div>
    </div>
  );
};
