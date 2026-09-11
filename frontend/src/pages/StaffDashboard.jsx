import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client.js';
import { StatusBadge } from '../components/StatusBadge.jsx';

const STATUS_FILTERS = ['', 'placed', 'accepted', 'processing', 'ready', 'completed', 'rejected', 'cancelled'];

// What each status is allowed to move to next - keeps the staff UI from
// offering nonsensical transitions (e.g. jumping straight to "completed").
const NEXT_ACTIONS = {
  placed: [
    { label: 'Accept', status: 'accepted' },
    { label: 'Reject', status: 'rejected', needsReason: true },
  ],
  accepted: [{ label: 'Start processing', status: 'processing' }],
  processing: [{ label: 'Mark ready for pickup', status: 'ready' }],
  ready: [{ label: 'Mark completed', status: 'completed' }],
};

export function StaffDashboard() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [status, setStatus] = useState('');
  const [q, setQ] = useState('');
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);

  async function load() {
    try {
      const [{ orders }, statsRes] = await Promise.all([
        api.staffOrders({ status, q }),
        api.staffStats(),
      ]);
      setOrders(orders);
      setStats(statsRes);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 8000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, q]);

  async function updateStatus(order, nextStatus, needsReason) {
    let reason;
    if (needsReason) {
      reason = window.prompt('Reason for rejecting this order:');
      if (!reason) return;
    }
    setBusyId(order.orderId);
    try {
      await api.updateStatus(order.orderId, { status: nextStatus, reason });
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="card wide">
      <h1>Staff dashboard</h1>

      {stats && (
        <div className="stats-row">
          <div className="stat">
            <span className="stat-num">{stats.total}</span> total orders
          </div>
          <div className="stat">
            <span className="stat-num">{stats.today}</span> today
          </div>
          {Object.entries(stats.byStatus).map(([s, n]) => (
            <div className="stat" key={s}>
              <span className="stat-num">{n}</span> {s}
            </div>
          ))}
        </div>
      )}

      <div className="filters">
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          {STATUS_FILTERS.map((s) => (
            <option key={s} value={s}>
              {s === '' ? 'All statuses' : s}
            </option>
          ))}
        </select>
        <input
          placeholder="Search by token, student, or filename…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {error && <p className="error">{error}</p>}

      <table className="staff-table">
        <thead>
          <tr>
            <th>Token</th>
            <th>Student</th>
            <th>File</th>
            <th>Options</th>
            <th>Total</th>
            <th>Payment</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.orderId}>
              <td>
                <Link to={`/orders/${o.orderId}`}>{o.orderId}</Link>
              </td>
              <td>{o.userName}</td>
              <td>
                <a href={api.staffFileUrl(o.orderId)} target="_blank" rel="noreferrer">
                  {o.fileName}
                </a>
              </td>
              <td className="small">
                {o.pages}pg · {o.options.copies}x · {o.options.colorMode} · {o.options.sided} · {o.options.binding}
              </td>
              <td>₹{o.cost.total.toFixed(2)}</td>
              <td>{o.paymentStatus}</td>
              <td>
                <StatusBadge status={o.status} />
              </td>
              <td className="actions-cell">
                {(NEXT_ACTIONS[o.status] || []).map((action) => (
                  <button
                    key={action.status}
                    disabled={busyId === o.orderId}
                    onClick={() => updateStatus(o, action.status, action.needsReason)}
                  >
                    {action.label}
                  </button>
                ))}
              </td>
            </tr>
          ))}
          {orders.length === 0 && (
            <tr>
              <td colSpan={8}>No orders match this filter.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
