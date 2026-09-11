import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { StatusBadge } from '../components/StatusBadge.jsx';

export function OrderDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function load() {
    try {
      const { order } = await api.getOrder(id);
      setOrder(order);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    load();
    // Poll every 5s so status changes made by staff show up without a manual
    // refresh - a lightweight stand-in for real push notifications.
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, [id]);

  async function pay() {
    setBusy(true);
    try {
      const { order } = await api.payOrder(id);
      setOrder(order);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function cancel() {
    setBusy(true);
    try {
      const { order } = await api.cancelOrder(id);
      setOrder(order);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (error) return <p className="error">{error}</p>;
  if (!order) return <p>Loading…</p>;

  const isOwner = user && user.email === order.userId;

  return (
    <div className="card">
      <div className="order-detail-header">
        <h1>{order.orderId}</h1>
        <StatusBadge status={order.status} />
      </div>

      <p>
        <strong>{order.fileName}</strong> · {order.pages} page(s) · {order.options.copies} cop{order.options.copies > 1 ? 'ies' : 'y'} ·{' '}
        {order.options.colorMode === 'color' ? 'Color' : 'B&W'} · {order.options.sided}-sided · {order.options.paperSize} ·{' '}
        binding: {order.options.binding}
      </p>
      {order.options.notes && <p className="hint">Note: {order.options.notes}</p>}

      <div className="cost-preview">
        <div>Print: ₹{order.cost.printCost.toFixed(2)}</div>
        <div>Binding: ₹{order.cost.bindingCost.toFixed(2)}</div>
        <div className="total">Total: ₹{order.cost.total.toFixed(2)}</div>
        <div>
          Payment: <strong>{order.paymentStatus}</strong> ({order.paymentMethod})
        </div>
      </div>

      {order.rejectionReason && <p className="error">Rejected: {order.rejectionReason}</p>}
      {order.estimatedReadyAt && <p>Estimated ready: {new Date(order.estimatedReadyAt).toLocaleString()}</p>}

      {isOwner && (
        <div className="actions">
          {order.paymentStatus === 'unpaid' && order.paymentMethod === 'online' && order.status !== 'cancelled' && (
            <button onClick={pay} disabled={busy}>
              Simulate payment
            </button>
          )}
          {order.status === 'placed' && (
            <button className="danger" onClick={cancel} disabled={busy}>
              Cancel order
            </button>
          )}
        </div>
      )}

      <h3>Status history</h3>
      <ul className="timeline">
        {order.statusHistory.map((h, i) => (
          <li key={i}>
            <StatusBadge status={h.status} /> <span>{new Date(h.at).toLocaleString()}</span>
          </li>
        ))}
      </ul>

      {user && user.role === 'staff' && (
        <button onClick={() => navigate('/staff')} className="btn-link">
          ← Back to staff dashboard
        </button>
      )}
    </div>
  );
}
