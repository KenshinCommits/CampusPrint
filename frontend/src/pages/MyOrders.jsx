import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client.js';
import { StatusBadge } from '../components/StatusBadge.jsx';

export function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .myOrders()
      .then(({ orders }) => setOrders(orders))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading…</p>;

  return (
    <div className="card">
      <h1>My orders</h1>
      {error && <p className="error">{error}</p>}
      {orders.length === 0 && <p>No orders yet - place your first print order!</p>}
      <div className="order-list">
        {orders.map((o) => (
          <Link key={o.orderId} to={`/orders/${o.orderId}`} className="order-row">
            <div className="order-row-main">
              <strong>{o.orderId}</strong>
              <span>{o.fileName}</span>
            </div>
            <div className="order-row-side">
              <span>₹{o.cost.total.toFixed(2)}</span>
              <StatusBadge status={o.status} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
