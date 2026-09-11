const LABELS = {
  placed: 'New',
  accepted: 'Accepted',
  processing: 'Processing',
  ready: 'Ready',
  completed: 'Completed',
  rejected: 'Rejected',
  cancelled: 'Cancelled',
};

export function StatusBadge({ status }) {
  return (
    <span className={`badge badge-${status}`}>
      <span className="dot" />
      {LABELS[status] || status}
    </span>
  );
}
