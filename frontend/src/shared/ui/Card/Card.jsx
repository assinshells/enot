/**
 * Shared UI: Card Component
 * Путь: src/shared/ui/Card/Card.jsx
 */
export const Card = ({
  children,
  title,
  className = "",
  bodyClassName = "p-4",
  shadow = true,
}) => {
  const cardClass = `card ${shadow ? "shadow" : ""} ${className}`;

  return (
    <div className={cardClass}>
      <div className={`card-body ${bodyClassName}`}>
        {title && <h2 className="card-title text-center mb-4">{title}</h2>}
        {children}
      </div>
    </div>
  );
};
