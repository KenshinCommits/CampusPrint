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
      {/* 1. Hero Section: Left title & button, Right 2D pixel printer illustration with sparkles */}
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
              fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              textTransform: 'uppercase',
              color: '#000814',
            }}
          >
            HEY, {firstName}.<br />READY TO PRINT?
          </h1>

          <div>
            <button
              type="button"
              onClick={() => navigate('/new-order')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#FFC300',
                color: '#000814',
                fontFamily: 'var(--font-heading)',
                fontWeight: 900,
                fontSize: '0.88rem',
                textTransform: 'uppercase',
                padding: '14px 24px',
                borderRadius: '12px',
                border: '2px solid #000814',
                boxShadow: '4px 4px 0px 0px #000814',
                cursor: 'pointer',
                transition: 'all 0.1s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FFD60A'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFC300'; }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'translate(2px, 2px)';
                e.currentTarget.style.boxShadow = '2px 2px 0px 0px #000814';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'translate(0px, 0px)';
                e.currentTarget.style.boxShadow = '4px 4px 0px 0px #000814';
              }}
            >
              <Plus size={18} strokeWidth={3} />
              <span>NEW PRINT ORDER</span>
            </button>
          </div>
        </div>

        {/* Right: Handcrafted Pixel Printer Graphic with Floating Stars */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          {/* Sparkles around printer */}
          <div style={{ position: 'absolute', top: '-10px', left: '-12px', color: '#FFC300' }}>✦</div>
          <div style={{ position: 'absolute', bottom: '0px', right: '-10px', color: '#FFD60A', fontSize: '1.2rem' }}>✦</div>
          <PixelPrinterGraphic size={150} />
        </div>
      </div>

      {/* 2. Top Metrics Strip (3 Cards in a row: Yellow, Tech Blue, White) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
        }}
      >
        {/* Card 1 ("ACTIVE ORDERS"): Electric arcade yellow (#FFD60A) */}
        <div
          style={{
            backgroundColor: '#FFD60A',
            color: '#000814',
            border: '2px solid #000814',
            boxShadow: '4px 4px 0px 0px #000814',
            borderRadius: '16px',
            padding: '20px 24px',
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
              color: '#000814',
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
              color: '#000814',
            }}
          >
            {activeOrders.length}
          </div>
        </div>

        {/* Card 2 ("READY FOR PICKUP"): Tech Blue (#003566) with #FFD60A number */}
        <div
          style={{
            backgroundColor: '#003566',
            color: '#FFFFFF',
            border: '2px solid #000814',
            boxShadow: '4px 4px 0px 0px #000814',
            borderRadius: '16px',
            padding: '20px 24px',
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
              color: '#FFFFFF',
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
              color: '#FFD60A',
            }}
          >
            {readyOrders.length}
          </div>
        </div>

        {/* Card 3 ("TOTAL ORDERS"): Clean card white */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            color: '#000814',
            border: '2px solid #000814',
            boxShadow: '4px 4px 0px 0px #000814',
            borderRadius: '16px',
            padding: '20px 24px',
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
              color: '#000814',
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
              color: '#000814',
            }}
          >
            {totalOrders}
          </div>
        </div>
      </div>

      {/* 3. Current Active Order Card with Pixel Ticket Graphic */}
      {currentOrder && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '2px solid #000814',
            boxShadow: '5px 5px 0px 0px #000814',
            borderRadius: '16px',
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
                  color: '#000814',
                }}
              >
                {currentOrder.orderId}
              </span>

              {/* Status Pill in Tech Blue #003566 with #FFD60A Text */}
              <span
                style={{
                  backgroundColor: '#003566',
                  color: '#FFD60A',
                  border: '2px solid #000814',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 900,
                  fontSize: '0.75rem',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                {currentOrder.status}
              </span>

              <span style={{ fontSize: '0.9rem', color: '#4B5563', fontWeight: 600 }}>
                {currentOrder.fileName} · {currentOrder.pages} {currentOrder.pages === 1 ? 'page' : 'pages'} ·{' '}
                {currentOrder.options?.colorMode === 'color' ? 'Color' : 'B&W'} ·{' '}
                {currentOrder.options?.sided === 'double' ? 'Double-sided' : 'Single'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => navigate(`/order/${currentOrder.orderId}`)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#FFC300',
                color: '#000814',
                fontFamily: 'var(--font-heading)',
                fontWeight: 900,
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                padding: '8px 16px',
                borderRadius: '12px',
                border: '2px solid #000814',
                boxShadow: '3px 3px 0px 0px #000814',
                cursor: 'pointer',
                transition: 'all 0.1s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FFD60A'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFC300'; }}
            >
              <span>VIEW ORDER</span>
              <ArrowRight size={14} strokeWidth={2.5} />
            </button>
          </div>

          {/* Progress Bar: track with 2px #000814 border and #FFC300 fill */}
          <div style={{ marginTop: '8px' }}>
            <div
              style={{
                width: '100%',
                height: '14px',
                backgroundColor: '#FBF8F1',
                border: '2px solid #000814',
                borderRadius: '9999px',
                overflow: 'hidden',
                boxShadow: '1px 1px 0px 0px #000814',
              }}
            >
              <div
                style={{
                  width: `${getProgressPercentage(currentOrder.status)}%`,
                  height: '100%',
                  backgroundColor: '#FFC300',
                  borderRight: '2px solid #000814',
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
                  backgroundColor: '#FFFFFF',
                  border: '2px solid #000814',
                  boxShadow: '2px 2px 0px 0px #000814',
                  borderRadius: '9999px',
                  padding: '4px 12px',
                  fontSize: '0.75rem',
                  fontWeight: 900,
                  color: '#000814',
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
        </div>
      )}

      {/* 4. Recent Orders Table with Dark Navy #001D3D Header */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '2px solid #000814',
          boxShadow: '4px 4px 0px 0px #000814',
          borderRadius: '16px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '18px 24px',
            borderBottom: '2px solid #000814',
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
              color: '#000814',
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
              color: '#000814',
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
                <tr style={{ backgroundColor: '#001D3D', borderBottom: '2px solid #000814' }}>
                  {['TOKEN', 'FILE', 'STATUS', 'TOTAL', 'PLACED', 'ACTION'].map((h, i) => (
                    <th
                      key={i}
                      style={{
                        padding: '12px 18px',
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 900,
                        fontSize: '0.78rem',
                        letterSpacing: '0.06em',
                        color: '#FFFFFF',
                        textTransform: 'uppercase',
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
                      borderBottom: '1px solid rgba(0, 8, 20, 0.12)',
                      backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FDFBF7',
                      transition: 'background-color 0.12s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 214, 10, 0.15)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = idx % 2 === 0 ? '#FFFFFF' : '#FDFBF7'; }}
                  >
                    <td style={{ padding: '14px 18px', fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '0.9rem', color: '#000814' }}>
                      {order.orderId}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.85rem', color: '#000814' }}>
                        <FileText size={16} color="#003566" />
                        <span>{order.fileName}</span>
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      {order.status === 'completed' ? (
                        <span
                          style={{
                            backgroundColor: '#BBF7D0',
                            color: '#000814',
                            border: '2px solid #000814',
                            fontFamily: 'var(--font-heading)',
                            fontWeight: 900,
                            fontSize: '0.75rem',
                            padding: '2.5px 10px',
                            borderRadius: '9999px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          COMPLETED
                        </span>
                      ) : (
                        <span
                          style={{
                            backgroundColor: '#FEF08A',
                            color: '#000814',
                            border: '2px solid #000814',
                            fontFamily: 'var(--font-heading)',
                            fontWeight: 900,
                            fontSize: '0.75rem',
                            padding: '2.5px 10px',
                            borderRadius: '9999px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            textTransform: 'uppercase',
                          }}
                        >
                          {order.status}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '14px 18px', fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '0.9rem', color: '#000814' }}>
                      ₹{order.cost?.total || 0}
                    </td>
                    <td style={{ padding: '14px 18px', color: '#4B5563', fontSize: '0.82rem', fontWeight: 600 }}>
                      {formatTimeAgo(order.createdAt)}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <button
                        type="button"
                        onClick={() => navigate(`/order/${order.orderId}`)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          backgroundColor: '#FFC300',
                          color: '#000814',
                          border: '2px solid #000814',
                          boxShadow: '2px 2px 0px 0px #000814',
                          fontSize: '0.75rem',
                          fontFamily: 'var(--font-heading)',
                          fontWeight: 900,
                          padding: '4px 12px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.1s ease',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FFD60A'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFC300'; }}
                      >
                        <span>VIEW</span>
                        <ArrowRight size={12} strokeWidth={2.5} />
                      </button>
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

export default StudentDashboard;
