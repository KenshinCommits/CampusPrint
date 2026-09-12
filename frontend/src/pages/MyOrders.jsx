import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client.js';
import { Search, Filter, FileText, ArrowRight, Plus } from 'lucide-react';

export function MyOrders() {
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

  function formatDate(dateStr) {
    if (!dateStr) return '11 Sep, 2:03 PM';
    const d = new Date(dateStr);
    return d.toLocaleDateString([], { day: 'numeric', month: 'short' }) + ', ' + d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Header: Title & Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              margin: 0,
            }}
          >
            MY ORDERS
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
            Track your print orders and their status
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', maxWidth: '340px', width: '100%' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search
              size={15}
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }}
            />
            <input
              type="text"
              className="neo-input"
              style={{ paddingLeft: '36px', height: '40px', fontSize: '0.85rem' }}
              placeholder="Search token, file or status..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <button
            type="button"
            className="neo-btn sm"
            style={{ height: '40px', width: '40px', padding: 0 }}
            title="Filters"
          >
            <Filter size={15} />
          </button>
        </div>
      </div>

      {/* Orders Table Container */}
      <div className="neo-table-container">
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center' }}>Loading orders…</div>
        ) : error ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#DC2626' }}>{error}</div>
        ) : filteredOrders.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <FileText size={44} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
            <h3 style={{ fontFamily: 'var(--font-heading)', color: '#000', marginBottom: '6px' }}>
              No orders found
            </h3>
            <p style={{ fontSize: '0.9rem' }}>You don't have any matching print orders.</p>
            <Link to="/order" className="neo-btn primary sm" style={{ marginTop: '16px' }}>
              <Plus size={14} />
              <span>+ New Print Order</span>
            </Link>
          </div>
        ) : (
          <div>
            <div style={{ overflowX: 'auto' }}>
              <table className="neo-table">
                <thead>
                  <tr>
                    <th>TOKEN</th>
                    <th>FILE</th>
                    <th>DATE</th>
                    <th>STATUS</th>
                    <th>PAYMENT</th>
                    <th>TOTAL</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedOrders.map((order) => {
                    const isPaid = order.paymentStatus === 'paid';
                    return (
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
                        <td style={{ color: 'var(--text-muted)', fontSize: '0.84rem' }}>
                          {formatDate(order.createdAt)}
                        </td>
                        <td>{getStatusBadge(order.status)}</td>
                        <td>
                          <span className={`neo-badge ${isPaid ? 'paid' : 'unpaid'}`}>
                            {isPaid ? 'PAID' : 'UNPAID'}
                          </span>
                        </td>
                        <td style={{ fontFamily: 'var(--font-heading)', fontWeight: 800 }}>
                          ₹{order.cost?.total || 0}
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
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls at Bottom Right */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                padding: '12px 18px',
                borderTop: '2px solid #000',
                gap: '6px',
                background: '#FFF',
              }}
            >
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  border: '2px solid #000',
                  background: '#FFF',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  opacity: currentPage === 1 ? 0.5 : 1,
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '1px 1px 0px #000',
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
                    width: '32px',
                    height: '32px',
                    borderRadius: '6px',
                    border: '2px solid #000',
                    background: currentPage === page ? '#FFD028' : '#FFF',
                    cursor: 'pointer',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '1px 1px 0px #000',
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
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  border: '2px solid #000',
                  background: '#FFF',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  opacity: currentPage === totalPages ? 0.5 : 1,
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '1px 1px 0px #000',
                }}
              >
                &gt;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
