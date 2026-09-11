export function Card({ className = '', wide, ...props }) {
  return <div className={`card ${className}`} {...props} />;
}
