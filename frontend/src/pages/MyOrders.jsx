import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';
import { NeoCard, NeoButton, StatusBadge } from '../components/ui/index.js';
import { PixelTicketGraphic } from '../components/PixelArt.jsx';
import { Search, Filter, FileText, ArrowRight, Plus } from 'lucide-react';

export function MyOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    api
      .myOrders()
      .then((data) => setOrders(data.orders || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredOrders = orders.filter((o) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (o.orderId || '').toLowerCase().includes(q) ||
      (o.fileName || '').toLowerCase().includes(q) ||
      (o.status || '').toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function formatDate(dateStr) {
    if (!dateStr) return '11 Sep, 2:03 PM';
    const d = new Date(dateStr);
    return (
      d.toLocaleDateString([], { day: 'numeric', month: 'short' }) +
      ', ' +
      d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Header: Title & Search/Filter Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 3.8vw, 2.6rem)',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              margin: 0,
              textTransform: 'uppercase',
              color: '#000000',
            }}
          >
            MY ORDERS
          </h1>
          <p style={{ color: '#4B5563', fontSize: '0.9rem', marginTop: '4px', fontWeight: 600 }}>
            Track and inspect your print orders in real time
          </p>
        </div>

        {/* Top search & filter bar with 2px black borders and hard shadows */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', maxWidth: '380px', width: '100%' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#6B7280',
              }}
            />
            <input
              type="text"
              placeholder="Search token, file or status..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                width: '100%',
                height: '44px',
                backgroundColor: '#FFFFFF',
                border: '2px solid #000000',
                borderRadius: '12px',
                boxShadow: '3px 3px 0px 0px #000000',
                paddingLeft: '42px',
                paddingRight: '14px',
                fontFamily: 'var(--font-body)',
                fontSize: '0.88rem',
                fontWeight: 600,
                outline: 'none',
              }}
            />
          </div>

          <button
            type="button"
            title="Filter options"
            style={{
              height: '44px',
              width: '44px',
              borderRadius: '12px',
              border: '2px solid #000000',
              backgroundColor: '#FFFFFF',
              boxShadow: '3px 3px 0px 0px #000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Orders Table Container */}
      <NeoCard variant="default" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
            Loading orders…
          </div>
        ) : error ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#DC2626', fontWeight: 700 }}>
            {error}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: '#6B7280', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <PixelTicketGraphic size={72} />
            <h3 style={{ fontFamily: 'var(--font-heading)', color: '#000000', margin: '8px 0 2px', fontWeight: 900, fontSize: '1.2rem' }}>
              No orders found
            </h3>
            <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>You don't have any matching print orders.</p>
            <div style={{ marginTop: '20px' }}>
              <NeoButton variant="primary" size="sm" onClick={() => navigate('/new-order')}>
                <Plus size={16} strokeWidth={3} />
                <span>+ New Print Order</span>
              </NeoButton>
            </div>
          </div>
        ) : (
          <div>
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
                    {['TOKEN', 'FILE', 'DATE', 'STATUS', 'PAYMENT', 'TOTAL', 'ACTION'].map((h, i) => (
                      <th
                        key={i}
                        style={{
                          padding: '14px 18px',
                          fontFamily: 'var(--font-heading)',
                          fontWeight: 900,
                          fontSize: '0.8rem',
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
                  {paginatedOrders.map((order, idx) => {
                    const isPaid = order.paymentStatus === 'paid';
                    return (
                      <tr
                        key={order.orderId}
                        style={{
                          borderBottom: idx !== paginatedOrders.length - 1 ? '1.5px solid #E2E8F0' : 'none',
                          backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FDFBF7', // alternating cream/white rows
                        }}
                      >
                        <td style={{ padding: '14px 18px', fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '0.92rem' }}>
                          {order.orderId}
                        </td>
                        <td style={{ padding: '14px 18px' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.88rem' }}>
                            <FileText size={16} color="#DC2626" />
                            <span>{order.fileName}</span>
                          </span>
                        </td>
                        <td style={{ padding: '14px 18px', color: '#6B7280', fontSize: '0.84rem', fontWeight: 600 }}>
                          {formatDate(order.createdAt)}
                        </td>
                        <td style={{ padding: '14px 18px' }}>
                          <StatusBadge status={order.status} />
                        </td>
                        <td style={{ padding: '14px 18px' }}>
                          <span
                            style={{
                              backgroundColor: isPaid ? '#BBF7D0' : '#FECACA',
                              border: '1.5px solid #000000',
                              borderRadius: '9999px',
                              padding: '2px 10px',
                              fontSize: '0.72rem',
                              fontFamily: 'var(--font-heading)',
                              fontWeight: 900,
                              color: '#000000',
                              letterSpacing: '0.02em',
                            }}
                          >
                            {isPaid ? 'PAID' : 'UNPAID'}
                          </span>
                        </td>
                        <td style={{ padding: '14px 18px', fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '0.92rem' }}>
                          ₹{order.cost?.total || 0}
                        </td>
                        <td style={{ padding: '14px 18px' }}>
                          <NeoButton
                            variant="primary"
                            size="sm"
                            onClick={() => navigate(`/order/${order.orderId}`)}
                            style={{ padding: '5px 12px', fontSize: '0.75rem' }}
                          >
                            <span>View</span>
                            <ArrowRight size={12} strokeWidth={2.5} />
                          </NeoButton>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Numbered pagination controls at the bottom (< [1] [2] >) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                padding: '14px 20px',
                borderTop: '2px solid #000000',
                gap: '8px',
                backgroundColor: '#FFFFFF',
              }}
            >
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  border: '2px solid #000000',
                  backgroundColor: '#FFFFFF',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  opacity: currentPage === 1 ? 0.4 : 1,
                  fontWeight: 900,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '2px 2px 0px 0px #000000',
                }}
              >
                &lt;
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    border: '2px solid #000000',
                    backgroundColor: currentPage === page ? '#FFC300' : '#FFFFFF',
                    cursor: 'pointer',
                    fontWeight: 900,
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '2px 2px 0px 0px #000000',
                  }}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  border: '2px solid #000000',
                  backgroundColor: '#FFFFFF',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  opacity: currentPage === totalPages ? 0.4 : 1,
                  fontWeight: 900,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '2px 2px 0px 0px #000000',
                }}
              >
                &gt;
              </button>
            </div>
          </div>
        )}
      </NeoCard>
    </div>
  );
}

export default MyOrders;
