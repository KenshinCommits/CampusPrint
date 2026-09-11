import { Link } from 'react-router-dom';
import { StatusBadge } from './StatusBadge.jsx';
import { api } from '../api/client.js';
import { formatCurrency, formatTime, optionsSummary } from '../utils/format.js';

export const NEXT_ACTIONS = {
  placed: [
    { label: 'Accept', status: 'accepted', variant: 'success' },
    { label: 'Reject', status: 'rejected', variant: 'danger', needsReason: true },
  ],
  accepted: [{ label: 'Start processing', status: 'processing', variant: 'secondary', needsEta: true }],
  processing: [{ label: 'Mark ready', status: 'ready', variant: 'success', needsEta: true }],
  ready: [{ label: 'Mark completed', status: 'completed', variant: 'dark' }],
};

export function QueueTable({ orders, busyId, onAction }) {
  return (
    <>
      <div className="queue-table-wrap">
        <table className="queue-table">
          <thead>
            <tr>
              <th>Token</th>
              <th>Student</th>
              <th>File</th>
              <th>Pages</th>
              <th>Requirements</th>
              <th>Payment</th>
              <th>Status</th>
              <th>ETA</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.orderId}>
                <td><Link to={`/orders/${o.orderId}`} className="mono-token">{o.orderId}</Link></td>
                <td>{o.userName}</td>
                <td className="muted">
                  <a href={api.staffFileUrl(o.orderId)} target="_blank" rel="noreferrer">
                    {o.fileName}
                  </a>
                </td>
                <td>{o.pages}</td>
                <td className="muted">{optionsSummary(o.options)}</td>
                <td>
                  <span className={`badge ${o.paymentStatus === 'paid' ? 'badge-ready' : 'badge-placed'}`}>
                    {o.paymentStatus === 'paid' ? 'Paid' : 'Due'}
                  </span>
                </td>
                <td><StatusBadge status={o.status} /></td>
                <td className="muted">{o.estimatedReadyAt ? formatTime(o.estimatedReadyAt) : '—'}</td>
                <td>
                  <div className="btn-row">
                    {(NEXT_ACTIONS[o.status] || []).map((action) => (
                      <button
                        key={action.status}
                        className={`btn btn-sm btn-${action.variant}`}
                        disabled={busyId === o.orderId}
                        onClick={() => onAction(o, action)}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="queue-cards">
        {orders.map((o) => (
          <div className="queue-card" key={o.orderId}>
            <div className="qc-top">
              <Link to={`/orders/${o.orderId}`} className="mono-token">{o.orderId}</Link>
              <StatusBadge status={o.status} />
            </div>
            <div className="qc-row"><span className="muted">Student</span><span>{o.userName}</span></div>
            <div className="qc-row"><span className="muted">File</span><span>{o.fileName}</span></div>
            <div className="qc-row"><span className="muted">Requirements</span><span>{optionsSummary(o.options)}</span></div>
            <div className="qc-row"><span className="muted">Total</span><span>{formatCurrency(o.cost.total)}</span></div>
            <div className="qc-row"><span className="muted">Payment</span><span>{o.paymentStatus === 'paid' ? 'Paid' : 'Due'}</span></div>
            {o.estimatedReadyAt && <div className="qc-row"><span className="muted">ETA</span><span>{formatTime(o.estimatedReadyAt)}</span></div>}
            <div className="qc-actions">
              {(NEXT_ACTIONS[o.status] || []).map((action) => (
                <button
                  key={action.status}
                  className={`btn btn-sm btn-${action.variant}`}
                  disabled={busyId === o.orderId}
                  onClick={() => onAction(o, action)}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
