import { useEffect, useState } from 'react';
import { api } from '../api/client.js';
import { Search, Download, Check, X, RefreshCw, Clock, ArrowRight, Eye, FileText, AlertTriangle } from 'lucide-react';
import { PrinterDemo } from '../components/PrinterDemo.jsx';
import { NeoCard, NeoButton, StatusBadge } from '../components/ui/index.js';

export function StaffDashboard() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ counts: {}, todayTotal: 0, totalOrders: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [updating, setUpdating] = useState(false);

  function loadQueue() {
    api
      .staffOrders({ status: statusFilter, q: searchQuery })
      .then((data) => setOrders(data.orders || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

    api
      .staffStats()
      .then((data) => setStats(data))
      .catch(() => {});
  }

  useEffect(() => {
    loadQueue();
    const interval = setInterval(loadQueue, 10000);
    return () => clearInterval(interval);
  }, [statusFilter, searchQuery]);

  async function handleStatusChange(orderId, nextStatus, reason) {
    setUpdating(true);
    try {
      await api.updateStatus(orderId, { status: nextStatus, reason });
      loadQueue();
      if (selectedOrder?.orderId === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: nextStatus } : null));
      }
      setRejectModalOpen(false);
      setRejectReason('');
    } catch (err) {
      alert(err.message || 'Failed to update order status');
    } finally {
      setUpdating(false);
    }
  }

  // Filter orders client-side for payment status if selected
  const displayOrders = orders.filter((o) => {
    if (paymentFilter && o.paymentStatus !== paymentFilter) return false;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Header Title & Refresh */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
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
            SHOP QUEUE
          </h1>
          <p style={{ color: '#4B5563', fontSize: '0.9rem', marginTop: '4px', fontWeight: 600 }}>
            Live print queue awaiting shop processing and hardware dispatch
          </p>
        </div>

        <NeoButton
          variant="secondary"
          size="sm"
          onClick={loadQueue}
          disabled={loading}
          style={{ gap: '8px' }}
        >
          <RefreshCw size={15} className={loading ? 'spin' : ''} />
          <span>Refresh Queue</span>
        </NeoButton>
      </div>

      {/* Top 5 Metric Cards: NEW ORDERS, ACCEPTED, PROCESSING, READY, TODAY'S ORDERS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
        }}
      >
        {/* NEW ORDERS: Yellow #FEF08A */}
        <NeoCard
          variant="yellow"
          style={{
            cursor: 'pointer',
            padding: '18px 20px',
            border: statusFilter === 'placed' ? '3px solid #000000' : '2px solid #000000',
            boxShadow: statusFilter === 'placed' ? '5px 5px 0px 0px #000000' : '3px 3px 0px 0px #000000',
          }}
          onClick={() => setStatusFilter(statusFilter === 'placed' ? '' : 'placed')}
        >
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '0.75rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            NEW ORDERS
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '2.2rem', marginTop: '4px', lineHeight: 1 }}>
            {stats.counts?.placed || 0}
          </div>
        </NeoCard>

        {/* ACCEPTED: Sky Blue #BAE6FD */}
        <NeoCard
          variant="sky"
          style={{
            cursor: 'pointer',
            padding: '18px 20px',
            border: statusFilter === 'accepted' ? '3px solid #000000' : '2px solid #000000',
            boxShadow: statusFilter === 'accepted' ? '5px 5px 0px 0px #000000' : '3px 3px 0px 0px #000000',
          }}
          onClick={() => setStatusFilter(statusFilter === 'accepted' ? '' : 'accepted')}
        >
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '0.75rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            ACCEPTED
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '2.2rem', marginTop: '4px', lineHeight: 1 }}>
            {stats.counts?.accepted || 0}
          </div>
        </NeoCard>

        {/* PROCESSING: Indigo/Lavender #C7D2FE */}
        <NeoCard
          variant="lavender"
          style={{
            cursor: 'pointer',
            padding: '18px 20px',
            border: statusFilter === 'processing' ? '3px solid #000000' : '2px solid #000000',
            boxShadow: statusFilter === 'processing' ? '5px 5px 0px 0px #000000' : '3px 3px 0px 0px #000000',
          }}
          onClick={() => setStatusFilter(statusFilter === 'processing' ? '' : 'processing')}
        >
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '0.75rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            PROCESSING
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '2.2rem', marginTop: '4px', lineHeight: 1 }}>
            {stats.counts?.processing || 0}
          </div>
        </NeoCard>

        {/* READY: Mint Green #BBF7D0 */}
        <NeoCard
          variant="mint"
          style={{
            cursor: 'pointer',
            padding: '18px 20px',
            border: statusFilter === 'ready' ? '3px solid #000000' : '2px solid #000000',
            boxShadow: statusFilter === 'ready' ? '5px 5px 0px 0px #000000' : '3px 3px 0px 0px #000000',
          }}
          onClick={() => setStatusFilter(statusFilter === 'ready' ? '' : 'ready')}
        >
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '0.75rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            READY
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '2.2rem', marginTop: '4px', lineHeight: 1 }}>
            {stats.counts?.ready || 0}
          </div>
        </NeoCard>

        {/* TODAY'S ORDERS: White card */}
        <NeoCard
          variant="default"
          style={{
            cursor: 'pointer',
            padding: '18px 20px',
            border: statusFilter === '' ? '3px solid #000000' : '2px solid #000000',
            boxShadow: statusFilter === '' ? '5px 5px 0px 0px #000000' : '3px 3px 0px 0px #000000',
          }}
          onClick={() => setStatusFilter('')}
        >
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '0.75rem', letterSpacing: '0.04em', textTransform: 'uppercase', color: '#6B7280' }}>
            TODAY'S ORDERS
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '2.2rem', marginTop: '4px', lineHeight: 1 }}>
            {stats.todayTotal || orders.length}
          </div>
        </NeoCard>
      </div>

      {/* Search and Filter Toolbar: Search bar + All Statuses dropdown + All Payments dropdown */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <div style={{ position: 'relative', flex: '1 1 260px' }}>
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
            placeholder="Search token, student or file..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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

        <div style={{ width: '180px' }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              width: '100%',
              height: '44px',
              backgroundColor: '#FFFFFF',
              border: '2px solid #000000',
              borderRadius: '12px',
              boxShadow: '3px 3px 0px 0px #000000',
              padding: '0 12px',
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="">All Statuses</option>
            <option value="placed">Placed (New)</option>
            <option value="accepted">Accepted</option>
            <option value="processing">Processing</option>
            <option value="ready">Ready</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div style={{ width: '180px' }}>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            style={{
              width: '100%',
              height: '44px',
              backgroundColor: '#FFFFFF',
              border: '2px solid #000000',
              borderRadius: '12px',
              boxShadow: '3px 3px 0px 0px #000000',
              padding: '0 12px',
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="">All Payments</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>
        </div>
      </div>

      {/* Queue Table: High-density table with yellow "Manage ->" action buttons */}
      <NeoCard variant="default" style={{ padding: 0, overflow: 'hidden' }}>
        {loading && orders.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
            Loading dispatch queue…
          </div>
        ) : error ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#DC2626', fontWeight: 700 }}>
            {error}
          </div>
        ) : displayOrders.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: '#6B7280', fontFamily: 'var(--font-heading)', fontWeight: 600 }}>
            No orders found in queue.
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
                  {['TOKEN', 'STUDENT', 'FILE', 'PAGES', 'REQ', 'PAYMENT', 'STATUS', 'ETA', 'ACTION'].map((h, i) => (
                    <th
                      key={i}
                      style={{
                        padding: '12px 16px',
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
                {displayOrders.map((order, idx) => {
                  const isPaid = order.paymentStatus === 'paid';
                  const isSelected = selectedOrder?.orderId === order.orderId;

                  return (
                    <tr
                      key={order.orderId}
                      style={{
                        borderBottom: idx !== displayOrders.length - 1 ? '1.5px solid #E2E8F0' : 'none',
                        backgroundColor: isSelected ? '#FFFDEB' : idx % 2 === 0 ? '#FFFFFF' : '#FDFBF7',
                      }}
                    >
                      <td style={{ padding: '12px 16px', fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '0.9rem' }}>
                        {order.orderId}
                      </td>
                      <td style={{ padding: '12px 16px', fontWeight: 700, fontSize: '0.85rem' }}>
                        {order.userName || order.userId}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.85rem' }}>
                          <FileText size={16} color="#DC2626" />
                          <span>{order.fileName}</span>
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', fontWeight: 800, fontSize: '0.85rem' }}>
                        {order.pages}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#4B5563', fontWeight: 600 }}>
                        {order.options?.colorMode === 'color' ? 'Color' : 'B&W'} · {order.options?.sided || 'double'}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
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
                          }}
                        >
                          {isPaid ? 'PAID' : 'UNPAID'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <StatusBadge status={order.status} />
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#4B5563', fontWeight: 700 }}>
                        {order.status === 'ready'
                          ? 'Ready'
                          : order.status === 'processing'
                          ? '~5 min'
                          : order.status === 'accepted'
                          ? '~10 min'
                          : '—'}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <NeoButton
                          variant="primary"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                          style={{ padding: '4px 12px', fontSize: '0.75rem' }}
                        >
                          <span>Manage</span>
                          <ArrowRight size={12} strokeWidth={2.5} />
                        </NeoButton>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </NeoCard>

      {/* Selected Order Drawer / Modal with 3D Simulation */}
      {selectedOrder && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
          onClick={() => setSelectedOrder(null)}
        >
          <div
            style={{
              maxWidth: '920px',
              width: '100%',
              maxHeight: '92vh',
              overflowY: 'auto',
              backgroundColor: '#FDFBF7',
              border: '2px solid #000000',
              borderRadius: '20px',
              boxShadow: '6px 6px 0px 0px #000000',
              padding: '28px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '2px solid #000000',
                paddingBottom: '16px',
                marginBottom: '20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 900,
                    fontSize: '1.5rem',
                    color: '#000000',
                  }}
                >
                  ORDER {selectedOrder.orderId}
                </span>
                <StatusBadge status={selectedOrder.status} />
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  border: '2px solid #000000',
                  backgroundColor: '#FFFFFF',
                  boxShadow: '2px 2px 0px 0px #000000',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* 3 Panels Row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '16px',
                marginBottom: '20px',
              }}
            >
              {/* Panel 1: Document File Preview */}
              <NeoCard variant="default" style={{ padding: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '64px',
                    height: '72px',
                    backgroundColor: '#FEE2E2',
                    border: '2px solid #000000',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#DC2626',
                  }}
                >
                  <FileText size={38} strokeWidth={2.2} />
                </div>
                <div>
                  <div style={{ fontWeight: 900, fontSize: '0.95rem', fontFamily: 'var(--font-heading)' }}>
                    {selectedOrder.fileName}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#4B5563', fontWeight: 700 }}>
                    {selectedOrder.pages} pages
                  </div>
                </div>

                <a
                  href={api.staffFileUrl(selectedOrder.orderId)}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    width: '100%',
                    backgroundColor: '#FFC300',
                    color: '#000000',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 900,
                    fontSize: '0.85rem',
                    textTransform: 'uppercase',
                    padding: '8px 14px',
                    borderRadius: '10px',
                    border: '2px solid #000000',
                    boxShadow: '2px 2px 0px 0px #000000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    textDecoration: 'none',
                  }}
                >
                  <Eye size={15} />
                  <span>Open PDF</span>
                </a>
              </NeoCard>

              {/* Panel 2: Requirements */}
              <NeoCard variant="default" style={{ padding: '20px' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.8rem',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    color: '#6B7280',
                    marginBottom: '12px',
                  }}
                >
                  PRINT REQUIREMENTS
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#4B5563', fontWeight: 600 }}>Copies:</span>
                    <span style={{ fontWeight: 800 }}>{selectedOrder.options?.copies || 1}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#4B5563', fontWeight: 600 }}>Color:</span>
                    <span style={{ fontWeight: 800 }}>{selectedOrder.options?.colorMode === 'color' ? 'Color' : 'B&W'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#4B5563', fontWeight: 600 }}>Sides:</span>
                    <span style={{ fontWeight: 800 }}>{selectedOrder.options?.sided || 'single'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#4B5563', fontWeight: 600 }}>Paper:</span>
                    <span style={{ fontWeight: 800 }}>{selectedOrder.options?.paperSize || 'A4'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#4B5563', fontWeight: 600 }}>Binding:</span>
                    <span style={{ fontWeight: 800, textTransform: 'capitalize' }}>{selectedOrder.options?.binding || 'none'}</span>
                  </div>
                </div>
              </NeoCard>

              {/* Panel 3: Status Transition Actions */}
              <NeoCard variant="default" style={{ padding: '20px' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.8rem',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    color: '#6B7280',
                    marginBottom: '12px',
                  }}
                >
                  ACTIONS
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {selectedOrder.status === 'placed' && (
                    <>
                      <NeoButton
                        variant="primary"
                        size="sm"
                        disabled={updating}
                        onClick={() => handleStatusChange(selectedOrder.orderId, 'accepted')}
                        style={{ width: '100%' }}
                      >
                        <Check size={16} />
                        <span>ACCEPT ORDER</span>
                      </NeoButton>
                      <button
                        type="button"
                        disabled={updating}
                        onClick={() => setRejectModalOpen(true)}
                        style={{
                          width: '100%',
                          backgroundColor: '#FECACA',
                          color: '#000000',
                          fontFamily: 'var(--font-heading)',
                          fontWeight: 900,
                          fontSize: '0.8rem',
                          textTransform: 'uppercase',
                          padding: '8px 14px',
                          borderRadius: '10px',
                          border: '2px solid #000000',
                          boxShadow: '2px 2px 0px 0px #000000',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                        }}
                      >
                        <X size={16} />
                        <span>REJECT ORDER</span>
                      </button>
                    </>
                  )}

                  {selectedOrder.status === 'accepted' && (
                    <NeoButton
                      variant="sky"
                      size="sm"
                      disabled={updating}
                      onClick={() => handleStatusChange(selectedOrder.orderId, 'processing')}
                      style={{ width: '100%' }}
                    >
                      <span>START PROCESSING</span>
                    </NeoButton>
                  )}

                  {selectedOrder.status === 'processing' && (
                    <NeoButton
                      variant="mint"
                      size="sm"
                      disabled={updating}
                      onClick={() => handleStatusChange(selectedOrder.orderId, 'ready')}
                      style={{ width: '100%' }}
                    >
                      <Check size={16} />
                      <span>MARK READY FOR PICKUP</span>
                    </NeoButton>
                  )}

                  {selectedOrder.status === 'ready' && (
                    <NeoButton
                      variant="dark"
                      size="sm"
                      disabled={updating}
                      onClick={() => handleStatusChange(selectedOrder.orderId, 'completed')}
                      style={{ width: '100%' }}
                    >
                      <Check size={16} />
                      <span>MARK COMPLETED</span>
                    </NeoButton>
                  )}

                  {selectedOrder.status === 'completed' && (
                    <div
                      style={{
                        backgroundColor: '#BBF7D0',
                        border: '1.5px solid #000000',
                        borderRadius: '10px',
                        padding: '10px',
                        textAlign: 'center',
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 900,
                        fontSize: '0.85rem',
                      }}
                    >
                      ORDER FULFILLED
                    </div>
                  )}
                </div>
              </NeoCard>
            </div>

            {/* 3D Hardware Simulation Dispatch Station */}
            <div style={{ marginBottom: '10px' }}>
              <PrinterDemo
                pdfUrl={api.staffFileUrl(selectedOrder.orderId)}
                order={selectedOrder}
                orderStatus={selectedOrder.status}
                height="340px"
                title="3D Hardware Dispatch Station"
              />
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
            padding: '20px',
          }}
          onClick={() => setRejectModalOpen(false)}
        >
          <NeoCard
            variant="default"
            style={{ maxWidth: '440px', width: '100%', padding: '24px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.2rem', marginBottom: '10px' }}>
              Reject Order {selectedOrder?.orderId}
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#4B5563', marginBottom: '14px', fontWeight: 600 }}>
              Specify the reason for rejection so the student is notified immediately.
            </p>
            <textarea
              rows={3}
              placeholder="e.g. Unreadable PDF formatting, paper size unavailable"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              style={{
                width: '100%',
                border: '2px solid #000000',
                borderRadius: '10px',
                padding: '10px 12px',
                fontFamily: 'var(--font-body)',
                fontSize: '0.88rem',
                resize: 'none',
                outline: 'none',
                backgroundColor: '#FFFFFF',
                boxShadow: '2px 2px 0px 0px #000000',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '18px' }}>
              <button
                type="button"
                onClick={() => setRejectModalOpen(false)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '10px',
                  border: '2px solid #000000',
                  backgroundColor: '#FFFFFF',
                  boxShadow: '2px 2px 0px 0px #000000',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 900,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleStatusChange(selectedOrder.orderId, 'rejected', rejectReason)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '10px',
                  border: '2px solid #000000',
                  backgroundColor: '#FECACA',
                  boxShadow: '2px 2px 0px 0px #000000',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 900,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                Confirm Reject
              </button>
            </div>
          </NeoCard>
        </div>
      )}
    </div>
  );
}

export default StaffDashboard;
