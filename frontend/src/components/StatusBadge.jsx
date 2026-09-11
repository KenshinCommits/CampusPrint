const COLORS = {
  placed: '#8a8f98',
  accepted: '#2b6cb0',
  processing: '#b7791f',
  ready: '#2f855a',
  completed: '#276749',
  rejected: '#c53030',
  cancelled: '#a0aec0',
};

export function StatusBadge({ status }) {
  const color = COLORS[status] || '#8a8f98';
  return (
    <span className="status-badge" style={{ backgroundColor: color }}>
      {status}
    </span>
  );
}
