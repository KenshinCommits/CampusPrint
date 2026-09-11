import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client.js';
import { OrderCard } from '../components/OrderCard.jsx';
import { EmptyState, Loader } from '../components/EmptyState.jsx';
import { Button } from '../components/Button.jsx';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'ready', label: 'Ready' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
  { key: 'rejected', label: 'Rejected' },
];

const ACTIVE_STATUSES = ['placed', 'accepted', 'processing'];

function matches(order, filter) {
  if (filter === 'all') return true;
  if (filter === 'active') return ACTIVE_STATUSES.includes(order.status);
  return order.status === filter;
}

export function MyOrders() {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api
      .myOrders()
      .then(({ orders }) => setOrders(orders))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <EmptyState icon="⚠" title="THAT DIDN'T WORK" subtitle={error} />;
  if (orders === null) return <Loader />;

  const filtered = orders.filter((o) => matches(o, filter));

  return (
    <div className="container medium">
      <h1>MY ORDERS</h1>

      {orders.length > 0 && (
        <div className="filter-tabs">
          {FILTERS.map((f) => (
            <button key={f.key} className={`filter-tab ${filter === f.key ? 'active' : ''}`} onClick={() => setFilter(f.key)}>
              {f.label}
            </button>
          ))}
        </div>
      )}

      {orders.length === 0 ? (
        <EmptyState
          icon="🖨"
          title="NOTHING HERE YET."
          subtitle="Your next print job starts here."
          action={
            <Button as={Link} to="/new-order" variant="primary">
              New Order →
            </Button>
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState icon="🔍" title="NO ORDERS HERE." subtitle="Try a different filter." />
      ) : (
        <div className="stack">
          {filtered.map((o) => (
            <OrderCard key={o.orderId} order={o} />
          ))}
        </div>
      )}
    </div>
  );
}
