/**
 * Shared UI: Card Component
 * Путь: src/shared/ui/Card/Card.jsx
 */
export const Card = ({ children }) => {
  return (
    <div className="right col-lg-5 col-md-12 d-flex flex-column">
      <div className="card border-0">{children}</div>
    </div>
  );
};
