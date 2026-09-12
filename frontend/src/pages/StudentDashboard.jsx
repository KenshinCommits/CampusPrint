import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../api/client.js';
import { PixelPrinterGraphic, PixelTicketGraphic, PixelSpeedWatch } from '../components/PixelArt.jsx';
import { NeoCard, NeoButton, StatusBadge } from '../components/ui/index.js';
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* 1. Hero Section: Left title & button, Right 2D pixel printer illustration */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.2rem, 4.5vw, 3rem)',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              textTransform: 'uppercase',
              color: '#000000',
            }}
          >
            HEY, {firstName}.<br />READY TO PRINT?
          </h1>

          <div>
            <NeoButton
              variant="primary"
              size="lg"
              onClick={() => navigate('/new-order')}
              style={{
                boxShadow: '4px 4px 0px 0px #000000',
              }}
            >
              <Plus size={18} strokeWidth={3} />
              <span>+ NEW PRINT ORDER</span>
            </NeoButton>
          </div>
        </div>

        {/* Right: Handcrafted Pixel Printer Graphic */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <PixelPrinterGraphic size={150} />
        </div>
      </div>

      {/* 2. Top Metrics Strip (3 Cards in a row) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
        }}
      >
        {/* Card 1 ("ACTIVE ORDERS"): Pale yellow background (#FEF08A) */}
        <NeoCard
          variant="yellow"
          style={{
            padding: '20px 24px',
            boxShadow: '3px 3px 0px 0px #000000',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '0.8rem',
              fontWeight: 900,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: '#000000',
            }}
          >
            ACTIVE ORDERS
          </div>
          <div
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '2.5rem',
              fontWeight: 900,
              lineHeight: 1,
              color: '#000000',
            }}
          >
            {activeOrders.length}
          </div>
        </NeoCard>

        {/* Card 2 ("READY FOR PICKUP"): Pale sky blue background (#BAE6FD) */}
        <NeoCard
          variant="sky"
          style={{
            padding: '20px 24px',
            boxShadow: '3px 3px 0px 0px #000000',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '0.8rem',
              fontWeight: 900,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: '#000000',
            }}
          >
            READY FOR PICKUP
          </div>
          <div
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '2.5rem',
              fontWeight: 900,
              lineHeight: 1,
              color: '#000000',
            }}
          >
            {readyOrders.length}
          </div>
        </NeoCard>

        {/* Card 3 ("TOTAL ORDERS"): Clean white/cream background */}
        <NeoCard
          variant="default"
          style={{
            padding: '20px 24px',
            boxShadow: '3px 3px 0px 0px #000000',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '0.8rem',
              fontWeight: 900,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: '#000000',
            }}
          >
            TOTAL ORDERS
          </div>
          <div
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '2.5rem',
              fontWeight: 900,
              lineHeight: 1,
              color: '#000000',
            }}
          >
            {totalOrders}
          </div>
        </NeoCard>
      </div>

      {/* 3. Current Active Order Card with Pixel Ticket Graphic */}
      {currentOrder && (
        <NeoCard
          variant="default"
          style={{
            padding: '24px 28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.8rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: '#6B7280',
              }}
            >
              CURRENT ORDER
            </div>
            <PixelTicketGraphic size={36} />
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.75rem',
                  fontWeight: 900,
                  letterSpacing: '-0.02em',
                  color: '#000000',
                }}
              >
                {currentOrder.orderId}
              </span>

              <StatusBadge status={currentOrder.status} />

              <span style={{ fontSize: '0.9rem', color: '#4B5563', fontWeight: 600 }}>
                {currentOrder.fileName} · {currentOrder.pages} {currentOrder.pages === 1 ? 'page' : 'pages'} ·{' '}
                {currentOrder.options?.colorMode === 'color' ? 'Color' : 'B&W'} ·{' '}
                {currentOrder.options?.sided === 'double' ? 'Double-sided' : 'Single'}
              </span>
            </div>

            <NeoButton
              variant="primary"
              size="sm"
              onClick={() => navigate(`/order/${currentOrder.orderId}`)}
            >
              <span>VIEW ORDER</span>
              <ArrowRight size={14} strokeWidth={2.5} />
            </NeoButton>
          </div>

          {/* Progress Bar: thick progress track with 2px black border and yellow #FFC300 fill */}
          <div style={{ marginTop: '8px' }}>
            <div
              style={{
                width: '100%',
                height: '14px',
                backgroundColor: '#F1F5F9',
                border: '2px solid #000000',
                borderRadius: '9999px',
                overflow: 'hidden',
                boxShadow: '1px 1px 0px 0px #000000',
              }}
            >
              <div
                style={{
                  width: `${getProgressPercentage(currentOrder.status)}%`,
                  height: '100%',
                  backgroundColor: '#FFC300',
                  borderRight: '2px solid #000000',
                  transition: 'width 0.4s ease',
                }}
              />
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.8rem',
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                color: '#4B5563',
                marginTop: '10px',
              }}
            >
              <span>{getProgressPercentage(currentOrder.status)}% Completed</span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#FEF08A',
                  border: '1.5px solid #000000',
                  borderRadius: '9999px',
                  padding: '3px 10px',
                  fontSize: '0.72rem',
                  fontWeight: 900,
                  color: '#000000',
                }}
              >
                <PixelSpeedWatch size={18} />
                <span>
                  {currentOrder.status === 'ready'
                    ? 'READY NOW!'
                    : currentOrder.status === 'completed'
                    ? 'COLLECTED'
                    : '~5-10 MIN'}
                </span>
              </span>
            </div>
          </div>
        </NeoCard>
      )}

      {/* 4. Recent Orders Table */}
      <NeoCard variant="default" style={{ padding: 0, overflow: 'hidden' }}>
        <div
          style={{
            padding: '18px 24px',
            borderBottom: '2px solid #000000',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#FDFBF7',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 900,
              fontSize: '1rem',
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
              color: '#000000',
            }}
          >
            RECENT ORDERS
          </div>

          <Link
            to="/orders"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '0.85rem',
              fontWeight: 800,
              color: '#000000',
              textDecoration: 'underline',
            }}
          >
            View all
          </Link>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
            Loading recent orders…
          </div>
        ) : orders.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280', fontFamily: 'var(--font-heading)', fontWeight: 600 }}>
            No orders placed yet. Click "+ NEW PRINT ORDER" to start.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left',
              }}
            >
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '2px solid #000000' }}>
                  {['TOKEN', 'FILE', 'STATUS', 'TOTAL', 'PLACED', 'ACTION'].map((h, i) => (
                    <th
                      key={i}
                      style={{
                        padding: '12px 18px',
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 900,
                        fontSize: '0.78rem',
                        letterSpacing: '0.04em',
                        color: '#000000',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((order, idx) => (
                  <tr
                    key={order.orderId}
                    style={{
                      borderBottom: idx !== orders.slice(0, 5).length - 1 ? '1.5px solid #E2E8F0' : 'none',
                      backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FDFBF7',
                    }}
                  >
                    <td style={{ padding: '14px 18px', fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '0.9rem' }}>
                      {order.orderId}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.85rem' }}>
                        <FileText size={16} color="#DC2626" />
                        <span>{order.fileName}</span>
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <StatusBadge status={order.status} />
                    </td>
                    <td style={{ padding: '14px 18px', fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '0.9rem' }}>
                      ₹{order.cost?.total || 0}
                    </td>
                    <td style={{ padding: '14px 18px', color: '#6B7280', fontSize: '0.82rem', fontWeight: 600 }}>
                      {formatTimeAgo(order.createdAt)}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <NeoButton
                        variant="primary"
                        size="sm"
                        onClick={() => navigate(`/order/${order.orderId}`)}
                        style={{ padding: '4px 12px', fontSize: '0.75rem' }}
                      >
                        <span>View</span>
                        <ArrowRight size={12} strokeWidth={2.5} />
                      </NeoButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </NeoCard>
    </div>
  );
}

export default StudentDashboard;
