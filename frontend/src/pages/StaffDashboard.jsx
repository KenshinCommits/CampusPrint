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
      {/* Top Header Title & Refresh */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
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
            SHOP QUEUE
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
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

      {/* Top 5 Metric Cards (Matching Mockup Panel 6) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '14px',
        }}
      >
        <div
          className="stat-card yellow"
          style={{
            cursor: 'pointer',
            border: statusFilter === 'placed' ? '3px solid #000' : '2px solid #000',
            boxShadow: statusFilter === 'placed' ? '5px 5px 0px #000' : '3px 3px 0px #000',
          }}
          onClick={() => setStatusFilter(statusFilter === 'placed' ? '' : 'placed')}
        >
          <div className="stat-card-label">NEW ORDERS</div>
          <div className="stat-card-number">{stats.counts?.placed || 0}</div>
        </div>

        <div
          className="stat-card sky-blue"
          style={{
            cursor: 'pointer',
            border: statusFilter === 'accepted' ? '3px solid #000' : '2px solid #000',
            boxShadow: statusFilter === 'accepted' ? '5px 5px 0px #000' : '3px 3px 0px #000',
          }}
          onClick={() => setStatusFilter(statusFilter === 'accepted' ? '' : 'accepted')}
        >
          <div className="stat-card-label">ACCEPTED</div>
          <div className="stat-card-number">{stats.counts?.accepted || 0}</div>
        </div>

        <div
          className="stat-card lavender"
          style={{
            cursor: 'pointer',
            border: statusFilter === 'processing' ? '3px solid #000' : '2px solid #000',
            boxShadow: statusFilter === 'processing' ? '5px 5px 0px #000' : '3px 3px 0px #000',
          }}
          onClick={() => setStatusFilter(statusFilter === 'processing' ? '' : 'processing')}
        >
          <div className="stat-card-label">PROCESSING</div>
          <div className="stat-card-number">{stats.counts?.processing || 0}</div>
        </div>

        <div
          className="stat-card mint"
          style={{
            cursor: 'pointer',
            border: statusFilter === 'ready' ? '3px solid #000' : '2px solid #000',
            boxShadow: statusFilter === 'ready' ? '5px 5px 0px #000' : '3px 3px 0px #000',
          }}
          onClick={() => setStatusFilter(statusFilter === 'ready' ? '' : 'ready')}
        >
          <div className="stat-card-label">READY</div>
          <div className="stat-card-number">{stats.counts?.ready || 0}</div>
        </div>

        <div
          className="stat-card cream"
          style={{
            cursor: 'pointer',
            border: statusFilter === '' ? '3px solid #000' : '2px solid #000',
            boxShadow: statusFilter === '' ? '5px 5px 0px #000' : '3px 3px 0px #000',
          }}
          onClick={() => setStatusFilter('')}
        >
          <div className="stat-card-label">TODAY'S ORDERS</div>
          <div className="stat-card-number">{stats.todayTotal || orders.length}</div>
        </div>
      </div>

      {/* Filter Row: Search Input + Status Dropdown + Payment Dropdown */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <div style={{ position: 'relative', flex: '1 1 240px' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
            }}
          />
          <input
            type="text"
            className="neo-input"
            style={{ paddingLeft: '38px', height: '42px', fontSize: '0.88rem' }}
            placeholder="Search token, student or file..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ width: '160px' }}>
          <select
            className="neo-select"
            style={{ height: '42px', fontSize: '0.88rem' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
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

        <div style={{ width: '160px' }}>
          <select
            className="neo-select"
            style={{ height: '42px', fontSize: '0.88rem' }}
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
          >
            <option value="">All Payments</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>
        </div>
      </div>

      {/* Order Queue Table Container */}
      <div className="neo-table-container">
        {loading && orders.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center' }}>Loading dispatch queue…</div>
        ) : error ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#DC2626' }}>{error}</div>
        ) : displayOrders.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No orders found in queue.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="neo-table">
              <thead>
                <tr>
                  <th>TOKEN</th>
                  <th>STUDENT</th>
                  <th>FILE</th>
                  <th>PAGES</th>
                  <th>REQ</th>
                  <th>PAYMENT</th>
                  <th>STATUS</th>
                  <th>ETA</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {displayOrders.map((order) => {
                  const isPaid = order.paymentStatus === 'paid';
                  const isSelected = selectedOrder?.orderId === order.orderId;

                  return (
                    <tr
                      key={order.orderId}
                      style={{ background: isSelected ? '#FEF9C3' : undefined }}
                    >
                      <td style={{ fontFamily: 'var(--font-heading)', fontWeight: 800 }}>
                        {order.orderId}
                      </td>
                      <td style={{ fontWeight: 600 }}>{order.userName || order.userId}</td>
                      <td>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                          <FileText size={15} color="#DC2626" />
                          <span>{order.fileName}</span>
                        </span>
                      </td>
                      <td style={{ fontWeight: 700 }}>{order.pages}</td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        {order.options?.colorMode === 'color' ? 'Color' : 'B&W'} · {order.options?.sided || 'double'}
                      </td>
                      <td>
                        <span className={`neo-badge ${isPaid ? 'paid' : 'unpaid'}`}>
                          {isPaid ? 'PAID' : 'UNPAID'}
                        </span>
                      </td>
                      <td>
                        <span className={`neo-badge ${order.status}`}>
                          {order.status === 'processing' ? 'PROCESSING' : order.status}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                        {order.status === 'ready'
                          ? 'Ready'
                          : order.status === 'processing'
                          ? '~5 min'
                          : order.status === 'accepted'
                          ? '~10 min'
                          : '—'}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="neo-btn sm"
                          style={{
                            padding: '4px 12px',
                            fontSize: '0.78rem',
                            background: '#FFD028',
                          }}
                          onClick={() => setSelectedOrder(order)}
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Selected Order Drawer / Modal with 3D Simulation */}
      {selectedOrder && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.65)',
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
            className="neo-card"
            style={{
              maxWidth: '900px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              background: '#FFFDF9',
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
                borderBottom: '2px solid #000',
                paddingBottom: '16px',
                marginBottom: '20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 900,
                    fontSize: '1.4rem',
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

            {/* 3 Panels Row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '16px',
                marginBottom: '20px',
              }}
            >
              {/* Panel 1: Document File Preview */}
              <div className="neo-card" style={{ background: '#FFF', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
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
                  className="neo-btn sm primary full-width"
                  style={{ textDecoration: 'none' }}
                >
                  <Eye size={14} />
                  <span>Open PDF</span>
                </a>
              </div>

              {/* Panel 2: Requirements */}
              <div className="neo-card" style={{ background: '#FFF' }}>
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
                </div>
              </div>

              {/* Panel 3: Status Transition Actions */}
              <div className="neo-card" style={{ background: '#FFF' }}>
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
                        className="neo-btn full-width sm"
                        style={{ background: '#FECACA' }}
                        disabled={updating}
                        onClick={() => setRejectModalOpen(true)}
                      >
                        <X size={16} />
                        <span>REJECT ORDER</span>
                      </button>
                    </>
                  )}

                  {selectedOrder.status === 'accepted' && (
                    <button
                      type="button"
                      className="neo-btn blue full-width sm"
                      disabled={updating}
                      onClick={() => handleStatusChange(selectedOrder.orderId, 'processing')}
                    >
                      <span>START PROCESSING</span>
                    </button>
                  )}

                  {selectedOrder.status === 'processing' && (
                    <button
                      type="button"
                      className="neo-btn full-width sm"
                      style={{ background: '#86EFAC' }}
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
                </div>
              </div>
            </div>

            {/* 3D Hardware Simulation Dispatch Station */}
            <div style={{ marginBottom: '20px' }}>
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
            background: 'rgba(0, 0, 0, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
            padding: '20px',
          }}
          onClick={() => setRejectModalOpen(false)}
        >
          <div
            className="neo-card"
            style={{ maxWidth: '420px', width: '100%', background: '#FFF' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, marginBottom: '12px' }}>
              Reject Order {selectedOrder?.orderId}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
              Specify the reason for rejection so the student is notified.
            </p>
            <textarea
              className="neo-textarea"
              rows={3}
              placeholder="e.g. Unreadable PDF formatting, paper size unavailable"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
              <button
                type="button"
                className="neo-btn sm"
                onClick={() => setRejectModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="neo-btn sm"
                style={{ background: '#FECACA' }}
                onClick={() => handleStatusChange(selectedOrder.orderId, 'rejected', rejectReason)}
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
