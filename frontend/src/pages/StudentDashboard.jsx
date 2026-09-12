import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../api/client.js';
import { PixelPrinter } from '../components/PixelArt.jsx';
import { Plus, FileText, ArrowRight } from 'lucide-react';

export function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .myOrders()
      .then((data) => setOrders(data.orders || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const firstName = user?.name ? user.name.split(' ')[0].toUpperCase() : 'DEMO';

  // Metrics
  const activeOrders = orders.filter((o) => ['placed', 'accepted', 'processing'].includes(o.status));
  const readyOrders = orders.filter((o) => o.status === 'ready');
  const totalOrders = orders.length;

  // Most prominent current order (first active or first ready or most recent)
  const currentOrder = activeOrders[0] || readyOrders[0] || orders[0];

  function getStatusBadge(status) {
    switch (status) {
      case 'processing':
        return <span className="neo-badge processing">PRINTING</span>;
      case 'ready':
        return <span className="neo-badge ready">READY</span>;
      case 'completed':
        return <span className="neo-badge completed">COMPLETED</span>;
      case 'rejected':
      case 'cancelled':
        return <span className="neo-badge rejected">{status}</span>;
      default:
        return <span className="neo-badge placed">PLACED</span>;
    }
  }

  function getProgressPercentage(status) {
    switch (status) {
      case 'placed':
        return 20;
      case 'accepted':
        return 45;
      case 'processing':
        return 75;
      case 'ready':
        return 95;
      case 'completed':
        return 100;
      default:
        return 15;
    }
  }

  function formatTimeAgo(dateStr) {
    if (!dateStr) return '1h ago';
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Banner with Heading, Button & Pixel Printer */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 4vw, 2.8rem)',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              lineHeight: 1.08,
              textTransform: 'uppercase',
            }}
          >
            HEY, {firstName}.<br />READY TO PRINT?
          </h1>

          <div>
            <Link
              to="/order"
              className="neo-btn primary"
              style={{
                fontSize: '0.9rem',
                padding: '10px 20px',
                gap: '8px',
              }}
            >
              <Plus size={16} strokeWidth={3} />
              <span>+ NEW PRINT ORDER</span>
            </Link>
          </div>
        </div>

        {/* Pixel Art Printer Graphic on Top Right */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <PixelPrinter width={180} height={140} />
        </div>
      </div>

      {/* 3-Column Stats Row (Yellow, Sky Blue, White) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '18px',
        }}
      >
        <div className="stat-card yellow">
          <div className="stat-card-label">ACTIVE ORDERS</div>
          <div className="stat-card-number">{activeOrders.length}</div>
        </div>

        <div className="stat-card sky-blue">
          <div className="stat-card-label">READY FOR PICKUP</div>
          <div className="stat-card-number">{readyOrders.length}</div>
        </div>

        <div className="stat-card cream">
          <div className="stat-card-label">TOTAL ORDERS</div>
          <div className="stat-card-number">{totalOrders}</div>
        </div>
      </div>

      {/* CURRENT ORDER Ticket Card */}
      {currentOrder && (
        <div
          className="neo-card"
          style={{
            background: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            padding: '24px 28px',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '0.78rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--text-muted)',
            }}
          >
            CURRENT ORDER
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.6rem',
                  fontWeight: 900,
                  letterSpacing: '-0.02em',
                }}
              >
                {currentOrder.orderId}
              </span>

              {getStatusBadge(currentOrder.status)}

              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                {currentOrder.fileName} · {currentOrder.pages} {currentOrder.pages === 1 ? 'page' : 'pages'} ·{' '}
                {currentOrder.options?.colorMode === 'color' ? 'Color' : 'B&W'} ·{' '}
                {currentOrder.options?.sided === 'double' ? 'Double-sided' : 'Single'}
              </span>
            </div>

            <Link to={`/order/${currentOrder.orderId}`} className="neo-btn primary sm">
              <span>VIEW ORDER</span>
              <ArrowRight size={14} strokeWidth={2.5} />
            </Link>
          </div>

          {/* Yellow Progress Bar */}
          <div style={{ marginTop: '6px' }}>
            <div
              style={{
                width: '100%',
                height: '12px',
                background: '#F1F5F9',
                border: '2px solid #000',
                borderRadius: '999px',
                overflow: 'hidden',
                boxShadow: '1px 1px 0px #000',
              }}
            >
              <div
                style={{
                  width: `${getProgressPercentage(currentOrder.status)}%`,
                  height: '100%',
                  background: '#FFD028',
                  borderRight: '2px solid #000',
                  transition: 'width 0.4s ease',
                }}
              />
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.78rem',
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                color: 'var(--text-muted)',
                marginTop: '8px',
              }}
            >
              <span>{getProgressPercentage(currentOrder.status)}% Completed</span>
              <span>
                {currentOrder.status === 'ready'
                  ? 'Ready Now!'
                  : currentOrder.status === 'completed'
                  ? 'Collected'
                  : '~5-10 min'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* RECENT ORDERS Table Container */}
      <div className="neo-table-container">
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '2px solid #000',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 900,
              fontSize: '1rem',
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
            }}
          >
            RECENT ORDERS
          </div>

          <Link
            to="/orders"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '0.82rem',
              fontWeight: 800,
              color: '#000',
              textDecoration: 'underline',
            }}
          >
            View all
          </Link>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>Loading recent orders…</div>
        ) : orders.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No orders placed yet. Click "+ NEW PRINT ORDER" to start.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="neo-table">
              <thead>
                <tr>
                  <th>TOKEN</th>
                  <th>FILE</th>
                  <th>STATUS</th>
                  <th>TOTAL</th>
                  <th>PLACED</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.orderId}>
                    <td style={{ fontFamily: 'var(--font-heading)', fontWeight: 800 }}>
                      {order.orderId}
                    </td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                        <FileText size={15} color="#DC2626" />
                        <span>{order.fileName}</span>
                      </span>
                    </td>
                    <td>{getStatusBadge(order.status)}</td>
                    <td style={{ fontFamily: 'var(--font-heading)', fontWeight: 800 }}>
                      ₹{order.cost?.total || 0}
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                      {formatTimeAgo(order.createdAt)}
                    </td>
                    <td>
                      <Link
                        to={`/order/${order.orderId}`}
                        className="neo-btn sm"
                        style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                      >
                        <span>View</span>
                        <ArrowRight size={12} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
