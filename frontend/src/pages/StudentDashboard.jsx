import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../api/client.js';
import { PlusCircle, FileText, CheckCircle2, Layers, ArrowRight, Sparkles, Clock, AlertCircle } from 'lucide-react';

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

  const firstName = user?.name ? user.name.split(' ')[0].toUpperCase() : 'STUDENT';

  // Metrics
  const activeOrders = orders.filter((o) => ['placed', 'accepted', 'processing'].includes(o.status));
  const readyOrders = orders.filter((o) => o.status === 'ready');
  const totalOrders = orders.length;

  // Most prominent current order (first active or first ready)
  const currentOrder = activeOrders[0] || readyOrders[0] || orders[0];

  function getStatusLabel(status) {
    if (status === 'processing') return 'PRINTING';
    if (status === 'ready') return 'READY FOR PICKUP';
    return status.toUpperCase();
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
        return 10;
    }
  }

  function formatTimeAgo(dateStr) {
    if (!dateStr) return '';
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
      {/* Header Banner */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
            }}
          >
            HEY, {firstName}.<br />READY TO PRINT?
          </h1>

          <div>
            <Link to="/order" className="neo-btn primary">
              <PlusCircle size={18} strokeWidth={2.5} />
              <span>NEW PRINT ORDER</span>
            </Link>
          </div>
        </div>

        {/* Fun Sticky Note Card */}
        <div
          style={{
            background: 'var(--yellow-primary)',
            border: '2.5px solid #003566',
            borderRadius: '10px',
            boxShadow: '3px 3px 0px #000814',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            transform: 'rotate(1deg)',
            maxWidth: '260px',
            color: '#000814',
          }}
        >
          <div
            style={{
              background: '#000814',
              color: '#FFC300',
              border: '2px solid #003566',
              borderRadius: '6px',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FileText size={28} strokeWidth={2.2} />
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, lineHeight: 1.2, color: '#000814' }}>
            <div style={{ fontSize: '0.85rem' }}>FAST</div>
            <div style={{ fontSize: '0.85rem' }}>EASY</div>
            <div style={{ fontSize: '0.85rem' }}>CONVENIENT</div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="metrics-row">
        <div className="metric-card">
          <div className="metric-header">
            <FileText size={16} />
            <span>ACTIVE ORDERS</span>
          </div>
          <div className="metric-number">{activeOrders.length}</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <CheckCircle2 size={16} color="#10B981" />
            <span>READY FOR PICKUP</span>
          </div>
          <div className="metric-number" style={{ color: '#047857' }}>
            {readyOrders.length}
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <Layers size={16} />
            <span>TOTAL ORDERS</span>
          </div>
          <div className="metric-number">{totalOrders}</div>
        </div>
      </div>

      {/* CURRENT ORDER Section */}
      {currentOrder && (
        <div className="neo-card">
          <div
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '10px',
            }}
          >
            CURRENT ORDER
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              marginBottom: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.6rem',
                  fontWeight: 900,
                }}
              >
                {currentOrder.orderId}
              </span>
              <span className={`neo-badge ${currentOrder.status}`}>
                {getStatusLabel(currentOrder.status)}
              </span>
            </div>

            <Link to={`/order/${currentOrder.orderId}`} className="neo-btn sm primary">
              <span>VIEW ORDER</span>
              <ArrowRight size={15} strokeWidth={2.5} />
            </Link>
          </div>

          <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '14px' }}>
            {currentOrder.pages} pages · {currentOrder.options?.copies || 1} copies ·{' '}
            {currentOrder.options?.colorMode === 'color' ? 'Color' : 'B&W'} ·{' '}
            {currentOrder.options?.sided === 'double' ? 'Double-sided' : 'Single-sided'}
          </div>

          {/* Progress Bar */}
          <div style={{ marginTop: '10px' }}>
            <div
              style={{
                width: '100%',
                height: '12px',
                background: '#001428',
                border: '2px solid #003566',
                borderRadius: '6px',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${getProgressPercentage(currentOrder.status)}%`,
                  background:
                    currentOrder.status === 'ready'
                      ? '#FFD60A'
                      : 'linear-gradient(90deg, #003566, #FFC300)',
                  transition: 'width 0.4s ease',
                }}
              />
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '6px',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
              }}
            >
              <span>{getProgressPercentage(currentOrder.status)}% Completed</span>
              <span>
                {currentOrder.status === 'ready'
                  ? 'Ready for pickup at counter!'
                  : currentOrder.status === 'processing'
                  ? 'Printing right now (~5-10 min)'
                  : 'In queue'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* RECENT ORDERS Section */}
      <div className="neo-card">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.2rem',
              fontWeight: 800,
              letterSpacing: '-0.01em',
            }}
          >
            RECENT ORDERS
          </h2>

          <Link
            to="/orders"
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: '0.85rem',
              color: '#FFC300',
              textDecoration: 'underline',
            }}
          >
            View all
          </Link>
        </div>

        {loading ? (
          <p style={{ padding: '20px', textAlign: 'center' }}>Loading orders…</p>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 20px', color: 'var(--text-muted)' }}>
            <FileText size={40} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
            <p style={{ fontWeight: 600 }}>No print orders placed yet.</p>
            <Link to="/order" className="neo-btn primary sm" style={{ marginTop: '12px' }}>
              Create your first order
            </Link>
          </div>
        ) : (
          <div className="neo-table-wrapper">
            <table className="neo-table">
              <thead>
                <tr>
                  <th>Token</th>
                  <th>File</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Placed</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.orderId}>
                    <td style={{ fontFamily: 'var(--font-heading)', fontWeight: 800 }}>
                      {order.orderId}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <FileText size={15} color="#DC2626" />
                        <span style={{ fontWeight: 600 }}>{order.fileName}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`neo-badge ${order.status}`}>
                        {order.status === 'processing' ? 'Printing' : order.status}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'var(--font-heading)', fontWeight: 800 }}>
                      ₹{order.cost?.total || 0}
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                      {formatTimeAgo(order.createdAt)}
                    </td>
                    <td>
                      <Link to={`/order/${order.orderId}`} className="neo-btn sm">
                        <span>View</span>
                        <ArrowRight size={13} />
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
