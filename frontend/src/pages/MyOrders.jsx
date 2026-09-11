import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client.js';
import { FileText, ArrowRight, Layers, AlertCircle, PlusCircle } from 'lucide-react';

const TABS = ['All', 'Active', 'Ready', 'Completed', 'Cancelled', 'Rejected'];

export function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    api
      .myOrders()
      .then((data) => setOrders(data.orders || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredOrders = orders.filter((order) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Active') return ['placed', 'accepted', 'processing'].includes(order.status);
    if (activeTab === 'Ready') return order.status === 'ready';
    if (activeTab === 'Completed') return order.status === 'completed';
    if (activeTab === 'Cancelled') return order.status === 'cancelled';
    if (activeTab === 'Rejected') return order.status === 'rejected';
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
            fontWeight: 900,
            letterSpacing: '-0.02em',
          }}
        >
          MY ORDERS
        </h1>

        <Link to="/order" className="neo-btn primary sm">
          <PlusCircle size={16} strokeWidth={2.5} />
          <span>New Order</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {TABS.map((tab) => {
          const isSelected = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              className={`option-btn ${isSelected ? 'selected' : ''}`}
              style={{ flex: 'none', padding: '6px 18px', borderRadius: '9999px' }}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Order Cards List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading orders…</div>
      ) : error ? (
        <div className="neo-card" style={{ textAlign: 'center', color: '#DC2626' }}>
          {error}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="neo-card" style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-muted)' }}>
          <FileText size={44} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
          <h3 style={{ fontFamily: 'var(--font-heading)', color: '#000', marginBottom: '6px' }}>
            No {activeTab !== 'All' ? activeTab.toLowerCase() : ''} orders found
          </h3>
          <p style={{ fontSize: '0.9rem' }}>Need something printed? Place an order now.</p>
          <Link to="/order" className="neo-btn primary sm" style={{ marginTop: '16px' }}>
            + Create Print Order
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredOrders.map((order) => (
            <div
              key={order.orderId}
              className="neo-card interactive"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
                padding: '18px 24px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.4rem',
                    fontWeight: 900,
                    minWidth: '100px',
                  }}
                >
                  {order.orderId}
                </span>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText size={16} color="#DC2626" />
                    <span style={{ fontWeight: 800, fontSize: '1rem' }}>{order.fileName}</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {order.pages} pages · {order.options?.copies || 1} copies ·{' '}
                    {order.options?.colorMode === 'color' ? 'Color' : 'B&W'} ·{' '}
                    {order.options?.sided === 'double' ? 'Double' : 'Single'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <span className={`neo-badge ${order.status}`}>
                  {order.status === 'processing'
                    ? 'PRINTING'
                    : order.status === 'ready'
                    ? 'READY FOR PICKUP'
                    : order.status.toUpperCase()}
                </span>

                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 900,
                    fontSize: '1.3rem',
                    minWidth: '60px',
                    textAlign: 'right',
                  }}
                >
                  ₹{order.cost?.total || 0}
                </div>

                <Link to={`/order/${order.orderId}`} className="neo-btn sm primary">
                  <span>VIEW ORDER</span>
                  <ArrowRight size={14} strokeWidth={2.5} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
