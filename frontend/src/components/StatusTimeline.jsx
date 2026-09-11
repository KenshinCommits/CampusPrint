import { formatTime } from '../utils/format.js';

const STEPS = [
  { key: 'placed', label: 'Order placed' },
  { key: 'accepted', label: 'Accepted' },
  { key: 'processing', label: 'Processing' },
  { key: 'ready', label: 'Ready for pickup' },
  { key: 'completed', label: 'Completed' },
];

export function StatusTimeline({ statusHistory, status, estimatedReadyAt }) {
  return (
    <ul className="timeline">
      {STEPS.map((step) => {
        const entry = statusHistory.find((h) => h.status === step.key);
        const isActive = step.key === status;
        const state = isActive ? 'active' : entry ? 'done' : 'pending';
        const icon = state === 'done' ? '✓' : state === 'active' ? '●' : '○';
        let time = entry ? formatTime(entry.at) : '';
        if (!entry && step.key === 'ready' && estimatedReadyAt) time = `~${formatTime(estimatedReadyAt)}`;

        return (
          <li key={step.key} className={`timeline-item ${state}`}>
            <div className="tl-line" />
            <div className="tl-node">{icon}</div>
            <div>
              <div className="tl-title">{step.label}</div>
              {time && <div className="tl-time">{time}</div>}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
