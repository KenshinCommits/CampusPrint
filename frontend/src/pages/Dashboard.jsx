import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { StatCard } from '../components/StatCard.jsx';
import { StatusBadge } from '../components/StatusBadge.jsx';
import { OrderCard } from '../components/OrderCard.jsx';
import { EmptyState, Loader } from '../components/EmptyState.jsx';
import { Button } from '../components/Button.jsx';
import { formatCurrency, minutesUntil, optionsSummary } from '../utils/format.js';

const STAGE_PROGRESS = { placed: 10, accepted: 32, processing: 65, ready: 92, completed: 100 };
const ACTIVE_STATUSES = ['placed', 'accepted', 'processing', 'ready'];

export function Dashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    function load() {
      api
        .myOrders()
        .then(({ orders }) => alive && setOrders(orders))
        .catch((err) => alive && setError(err.message));
    }
    load();
    const interval = setInterval(load, 6000);
    return () => {
      alive = false;
      clearInterval(interval);
    };
  }, []);

  if (error) return <EmptyState icon="⚠" title="THAT DIDN'T WORK" subtitle={error} />;
  if (orders === null) return <Loader />;

  const active = orders.filter((o) => ACTIVE_STATUSES.includes(o.status));
  const ready = orders.filter((o) => o.status === 'ready');
  const current = active[0];
  const recent = orders.slice(0, 5);
  const firstName = (user?.name || '').split(' ')[0];

  return (
    <div className="container">
      <div className="row between" style={{ marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <span className="eyebrow">STUDENT DASHBOARD</span>
          <h1>HEY, {firstName.toUpperCase()}. READY TO PRINT?</h1>
        </div>
        <Button as={Link} to="/new-order" variant="primary">
          + New Print Order
        </Button>
      </div>

      <div className="grid grid-3" style={{ marginBottom: 28 }}>
        <StatCard label="Active Orders" value={active.length} tone="yellow" />
        <StatCard label="Ready For Pickup" value={ready.length} tone="lime" />
        <StatCard label="Total Orders" value={orders.length} tone="dark" />
      </div>

      {current ? (
        <div className="card" style={{ marginBottom: 28 }}>
          <div className="section-title">
            <h3 className="upper" style={{ margin: 0 }}>Current Order</h3>
            <StatusBadge status={current.status} />
          </div>
          <p className="mono-token" style={{ fontSize: '1.3rem', marginBottom: 4 }}>{current.orderId}</p>
          <p className="muted" style={{ marginBottom: 16 }}>
            {current.pages} pages · {current.options.copies} cop{current.options.copies > 1 ? 'ies' : 'y'} · {optionsSummary(current.options)}
          </p>

          <div className="progress-track" style={{ marginBottom: 10 }}>
            <div className={`progress-fill ${current.status === 'ready' ? 'lime' : ''}`} style={{ width: `${STAGE_PROGRESS[current.status]}%` }} />
          </div>

          <div className="row between" style={{ flexWrap: 'wrap', gap: 12 }}>
            <span className="muted">
              {current.status === 'ready'
                ? 'READY NOW'
                : current.estimatedReadyAt
                ? `Ready in ~${minutesUntil(current.estimatedReadyAt)} min`
                : `Total ${formatCurrency(current.cost.total)}`}
            </span>
            <Button as={Link} to={`/orders/${current.orderId}`} variant="secondary" size="sm">
              View Order →
            </Button>
          </div>
        </div>
      ) : (
        orders.length > 0 && (
          <div className="panel" style={{ marginBottom: 28 }}>
            <p style={{ margin: 0 }}>No active order right now. Ready when you are.</p>
          </div>
        )
      )}

      <div className="section-title">
        <h3 className="upper" style={{ margin: 0 }}>Recent Orders</h3>
        {orders.length > 0 && (
          <Link to="/my-orders" style={{ fontWeight: 700, fontSize: '0.85rem' }}>
            VIEW ALL →
          </Link>
        )}
      </div>

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
      ) : (
        <div className="stack">
          {recent.map((o) => (
            <OrderCard key={o.orderId} order={o} />
          ))}
        </div>
      )}
    </div>
  );
}
