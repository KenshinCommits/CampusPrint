import { useEffect, useState } from 'react';
import { api } from '../api/client.js';
import { Search, Download, Check, X, RefreshCw, Clock, ArrowRight, Eye, FileText, AlertTriangle } from 'lucide-react';
import { PrinterDemo } from '../components/PrinterDemo.jsx';

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
              fontWeight: 900,
              letterSpacing: '-0.02em',
            }}
          >
            SHOP QUEUE
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Live orders awaiting processing and dispatch
          </p>
        </div>

        <button
          type="button"
          className="neo-btn sm"
          onClick={loadQueue}
          disabled={loading}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <RefreshCw size={15} className={loading ? 'spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Top 5 Metric Cards (Matching Mockup Slide 6) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '14px',
        }}
      >
        <div
          className="neo-card"
          style={{
            background: '#FEF08A',
            padding: '16px',
            cursor: 'pointer',
            border: statusFilter === 'placed' ? '3px solid #000' : '2px solid #000',
          }}
          onClick={() => setStatusFilter(statusFilter === 'placed' ? '' : 'placed')}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
            NEW ORDERS
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 900, marginTop: '4px' }}>
            {stats.counts?.placed || 0}
          </div>
        </div>

        <div
          className="neo-card"
          style={{
            background: '#BFDBFE',
            padding: '16px',
            cursor: 'pointer',
            border: statusFilter === 'accepted' ? '3px solid #000' : '2px solid #000',
          }}
          onClick={() => setStatusFilter(statusFilter === 'accepted' ? '' : 'accepted')}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
            ACCEPTED
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 900, marginTop: '4px' }}>
            {stats.counts?.accepted || 0}
          </div>
        </div>

        <div
          className="neo-card"
          style={{
            background: '#93C5FD',
            padding: '16px',
            cursor: 'pointer',
            border: statusFilter === 'processing' ? '3px solid #000' : '2px solid #000',
          }}
          onClick={() => setStatusFilter(statusFilter === 'processing' ? '' : 'processing')}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
            PROCESSING
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 900, marginTop: '4px' }}>
            {stats.counts?.processing || 0}
          </div>
        </div>

        <div
          className="neo-card"
          style={{
            background: '#86EFAC',
            padding: '16px',
            cursor: 'pointer',
            border: statusFilter === 'ready' ? '3px solid #000' : '2px solid #000',
          }}
          onClick={() => setStatusFilter(statusFilter === 'ready' ? '' : 'ready')}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
            READY
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 900, marginTop: '4px' }}>
            {stats.counts?.ready || 0}
          </div>
        </div>

        <div
          className="neo-card"
          style={{
            background: '#FFFDF9',
            padding: '16px',
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text-muted)' }}>
            TODAY'S ORDERS
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 900, marginTop: '4px' }}>
            {stats.todayTotal || stats.totalOrders || 0}
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          alignItems: 'center',
          background: '#fff',
          border: '2px solid #000',
          borderRadius: '8px',
          padding: '12px 16px',
          boxShadow: '2px 2px 0px #000',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '220px' }}>
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search token, student or file..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              width: '100%',
              fontSize: '0.9rem',
              fontFamily: 'inherit',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="neo-select"
            style={{ width: 'auto', padding: '6px 12px', fontSize: '0.85rem' }}
          >
            <option value="">All Statuses</option>
            <option value="placed">Placed (New)</option>
            <option value="accepted">Accepted</option>
            <option value="processing">Processing</option>
            <option value="ready">Ready</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="neo-select"
            style={{ width: 'auto', padding: '6px 12px', fontSize: '0.85rem' }}
          >
            <option value="">All Payments</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>
        </div>
      </div>

      {/* Main Queue Table */}
      <div className="neo-table-wrapper">
        <table className="neo-table">
          <thead>
            <tr>
              <th>TOKEN</th>
              <th>STUDENT</th>
              <th>FILE</th>
              <th>PAGES</th>
              <th>REQ.</th>
              <th>PAYMENT</th>
              <th>STATUS</th>
              <th>ETA</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '30px' }}>
                  Loading queue…
                </td>
              </tr>
            ) : displayOrders.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  No orders match current criteria.
                </td>
              </tr>
            ) : (
              displayOrders.map((order) => (
                <tr key={order.orderId}>
                  <td style={{ fontFamily: 'var(--font-heading)', fontWeight: 800 }}>
                    {order.orderId}
                  </td>
                  <td>
                    <div style={{ fontWeight: 700 }}>{order.userName || order.userId}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.userId}</div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FileText size={15} color="#DC2626" />
                      <span style={{ fontWeight: 600 }}>{order.fileName}</span>
                    </div>
                  </td>
                  <td style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
                    {order.pages}
                  </td>
                  <td style={{ fontSize: '0.82rem' }}>
                    {order.options?.colorMode === 'color' ? 'Color' : 'B&W'} ·{' '}
                    {order.options?.sided === 'double' ? 'Double' : 'Single'}
                  </td>
                  <td>
                    <span className={`neo-badge ${order.paymentStatus === 'paid' ? 'paid' : 'unpaid'}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <span className={`neo-badge ${order.status}`}>
                      {order.status === 'processing' ? 'PROCESSING' : order.status}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {order.status === 'ready'
                      ? 'Ready'
                      : order.status === 'processing'
                      ? '~5 min'
                      : order.status === 'accepted'
                      ? '~15 min'
                      : '—'}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="neo-btn sm primary"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <Eye size={13} />
                      <span>Manage</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Selected Order Manage Modal / Detail Panel (Matching Slide 7) */}
      {selectedOrder && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 1000,
          }}
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="neo-card"
            style={{
              maxWidth: '800px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              background: 'var(--bg-cream)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
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
                  ORDER {selectedOrder.orderId}
                </span>
                <span className={`neo-badge ${selectedOrder.status}`}>
                  {selectedOrder.status}
                </span>
              </div>

              <button
                type="button"
                className="neo-btn sm"
                onClick={() => setSelectedOrder(null)}
              >
                <X size={18} />
              </button>
            </div>

            {/* 3 Panels Row matching Slide 7 */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '16px',
                marginBottom: '20px',
              }}
            >
              {/* Panel 1: Document File Preview */}
              <div className="neo-card" style={{ background: '#fff', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '60px',
                    height: '70px',
                    background: '#FEE2E2',
                    border: '2px solid #000',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#DC2626',
                  }}
                >
                  <FileText size={36} strokeWidth={2.2} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>
                    {selectedOrder.fileName}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {selectedOrder.pages} pages
                  </div>
                </div>

                <a
                  href={api.staffFileUrl(selectedOrder.orderId)}
                  target="_blank"
                  rel="noreferrer"
                  download={selectedOrder.fileName}
                  className="neo-btn sm primary full-width"
                >
                  <Download size={14} />
                  <span>DOWNLOAD FILE</span>
                </a>
              </div>

              {/* Panel 2: Requirements */}
              <div className="neo-card" style={{ background: '#fff' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                    marginBottom: '10px',
                  }}
                >
                  PRINT REQUIREMENTS
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Copies:</span>
                    <span style={{ fontWeight: 700 }}>{selectedOrder.options?.copies || 1}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Color:</span>
                    <span style={{ fontWeight: 700 }}>{selectedOrder.options?.colorMode === 'color' ? 'Color' : 'B&W'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Sides:</span>
                    <span style={{ fontWeight: 700 }}>{selectedOrder.options?.sided || 'single'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Paper:</span>
                    <span style={{ fontWeight: 700 }}>{selectedOrder.options?.paperSize || 'A4'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Binding:</span>
                    <span style={{ fontWeight: 700, textTransform: 'capitalize' }}>{selectedOrder.options?.binding || 'none'}</span>
                  </div>
                  <div style={{ borderTop: '1px dashed #ccc', margin: '4px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Payment:</span>
                    <span className={`neo-badge ${selectedOrder.paymentStatus === 'paid' ? 'paid' : 'unpaid'}`}>
                      {selectedOrder.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Panel 3: Actions */}
              <div className="neo-card" style={{ background: '#fff' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                    marginBottom: '12px',
                  }}
                >
                  ACTIONS
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {selectedOrder.status === 'placed' && (
                    <>
                      <button
                        type="button"
                        className="neo-btn primary full-width sm"
                        disabled={updating}
                        onClick={() => handleStatusChange(selectedOrder.orderId, 'accepted')}
                      >
                        <Check size={16} />
                        <span>ACCEPT ORDER</span>
                      </button>
                      <button
                        type="button"
                        className="neo-btn danger full-width sm"
                        disabled={updating}
                        onClick={() => setRejectModalOpen(true)}
                      >
                        <X size={16} />
                        <span>REJECT ORDER</span>
                      </button>
                    </>
                  )}

                  {selectedOrder.status === 'accepted' && (
                    <>
                      <button
                        type="button"
                        className="neo-btn blue full-width sm"
                        disabled={updating}
                        onClick={() => handleStatusChange(selectedOrder.orderId, 'processing')}
                      >
                        <span>START PROCESSING</span>
                      </button>
                      <button
                        type="button"
                        className="neo-btn danger full-width sm"
                        disabled={updating}
                        onClick={() => setRejectModalOpen(true)}
                      >
                        <X size={16} />
                        <span>REJECT ORDER</span>
                      </button>
                    </>
                  )}

                  {selectedOrder.status === 'processing' && (
                    <button
                      type="button"
                      className="neo-btn success full-width sm"
                      disabled={updating}
                      onClick={() => handleStatusChange(selectedOrder.orderId, 'ready')}
                    >
                      <Check size={16} />
                      <span>MARK READY FOR PICKUP</span>
                    </button>
                  )}

                  {selectedOrder.status === 'ready' && (
                    <button
                      type="button"
                      className="neo-btn dark full-width sm"
                      disabled={updating}
                      onClick={() => handleStatusChange(selectedOrder.orderId, 'completed')}
                    >
                      <Check size={16} />
                      <span>MARK COMPLETED</span>
                    </button>
                  )}

                  {['completed', 'rejected', 'cancelled'].includes(selectedOrder.status) && (
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      No further status transitions available.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 3D Physical Hardware Simulator */}
            <div style={{ marginBottom: '20px' }}>
              <PrinterDemo
                pdfUrl={api.staffFileUrl(selectedOrder.orderId)}
                order={selectedOrder}
                autoPrint={selectedOrder.status === 'processing' || selectedOrder.status === 'ready' || selectedOrder.status === 'completed'}
                height="340px"
                title="3D Hardware Dispatch Station"
              />
            </div>

            {/* Rejection Prompt Section */}
            {rejectModalOpen && (
              <div
                style={{
                  background: '#FEE2E2',
                  border: '2px solid #EF4444',
                  borderRadius: '8px',
                  padding: '16px',
                  marginTop: '16px',
                }}
              >
                <div style={{ fontWeight: 800, color: '#991B1B', marginBottom: '8px' }}>
                  State reason for rejection (required by backend):
                </div>
                <input
                  type="text"
                  className="neo-input"
                  placeholder="e.g. Unreadable file format, corrupted PDF, etc."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  style={{ background: '#fff', marginBottom: '10px' }}
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    className="neo-btn danger sm"
                    disabled={updating || !rejectReason.trim()}
                    onClick={() => handleStatusChange(selectedOrder.orderId, 'rejected', rejectReason)}
                  >
                    Confirm Rejection
                  </button>
                  <button
                    type="button"
                    className="neo-btn sm"
                    onClick={() => setRejectModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
