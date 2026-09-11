export function EmptyState({ icon = '📭', title, subtitle, action }) {
  return (
    <div className="state-block">
      <div className="state-icon">{icon}</div>
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
      {action}
    </div>
  );
}

export function Loader({ label = 'GETTING THINGS READY…' }) {
  return (
    <div className="state-block">
      <div className="loading-dots" style={{ marginBottom: 16 }}>
        <span />
        <span />
        <span />
      </div>
      <h2>{label}</h2>
    </div>
  );
}
