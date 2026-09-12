import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api/client.js';
import {
  Search,
  Download,
  Check,
  X,
  RefreshCw,
  Clock,
  ArrowRight,
  Eye,
  FileText,
  AlertTriangle,
  BarChart3,
  TrendingUp,
  IndianRupee,
  Printer,
  Layers,
  PieChart,
  CheckCircle2,
} from 'lucide-react';
import { PrinterDemo } from '../components/PrinterDemo.jsx';
import { NeoCard, NeoButton, StatusBadge } from '../components/ui/index.js';
import { PixelUploadDoc, PixelPrinterGraphic } from '../components/PixelArt.jsx';

export function StaffDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'queue';

  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ counts: {}, todayTotal: 0, totalOrders: 0, revenue: { total: 0, today: 0 } });
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
      .staffOrders({ q: searchQuery })
      .then((data) => setOrders(data.orders || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

    api
      .staffStats()
      .then((data) => {
        const counts = data.counts || data.byStatus || {};
        setStats({
          ...data,
          counts,
          byStatus: counts,
          todayTotal: data.todayTotal ?? data.today ?? 0,
          totalOrders: data.totalOrders ?? data.total ?? 0,
          revenue: data.revenue || { total: 0, today: 0 },
          totalPages: data.totalPages || 0,
        });
      })
      .catch(() => {});
  }

  useEffect(() => {
    loadQueue();
    const interval = setInterval(loadQueue, 10000);
    return () => clearInterval(interval);
  }, [searchQuery]);

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

  // Derive counts from API stats with complete fallback to orders list
  const orderCounts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  const countPlaced = (stats.counts?.placed ?? stats.byStatus?.placed) ?? (orderCounts.placed || 0);
  const countAccepted = (stats.counts?.accepted ?? stats.byStatus?.accepted) ?? (orderCounts.accepted || 0);
  const countProcessing = (stats.counts?.processing ?? stats.byStatus?.processing) ?? (orderCounts.processing || 0);
  const countReady = (stats.counts?.ready ?? stats.byStatus?.ready) ?? (orderCounts.ready || 0);
  const countCompleted = (stats.counts?.completed ?? stats.byStatus?.completed) ?? (orderCounts.completed || 0);
  const countRejected = (stats.counts?.rejected ?? stats.byStatus?.rejected) ?? (orderCounts.rejected || 0);
  const countToday = stats.todayTotal || stats.today || stats.totalOrders || stats.total || orders.length;

  const totalRevenue = stats.revenue?.total || orders.reduce((acc, o) => acc + (o.cost?.total || 0), 0);
  const todayRevenue = stats.revenue?.today || orders.reduce((acc, o) => acc + (o.cost?.total || 0), 0);
  const totalPages = stats.totalPages || orders.reduce((acc, o) => acc + (o.pages || 0), 0);
  const colorPages = stats.totalColorPages || orders.reduce((acc, o) => acc + (o.options?.colorMode === 'color' ? (o.pages || 0) : 0), 0);
  const bwPages = Math.max(0, totalPages - colorPages);

  // Filter orders client-side
  const displayOrders = orders.filter((o) => {
    if (activeTab === 'queue') {
      // In queue tab, prioritize active orders unless specifically filtered
      if (!statusFilter && ['completed', 'rejected', 'cancelled'].includes(o.status)) return false;
    }
    if (statusFilter && o.status !== statusFilter) return false;
    if (paymentFilter && o.paymentStatus !== paymentFilter) return false;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
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
              color: '#000814',
            }}
          >
            {activeTab === 'stats' ? 'SHOP STATISTICS' : activeTab === 'orders' ? 'ALL ORDERS' : 'SHOP QUEUE'}
          </h1>
          <p style={{ color: '#4B5563', fontSize: '0.9rem', marginTop: '4px', fontWeight: 600 }}>
            {activeTab === 'stats'
              ? 'Real-time financial analytics, volume distribution & shop metrics'
              : activeTab === 'orders'
              ? 'Complete searchable transaction logs and historical orders'
              : 'Live print queue awaiting shop processing and hardware dispatch'}
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

      {/* Navigation Sub-Tabs */}
      <div style={{ display: 'flex', gap: '10px', borderBottom: '2px solid #000814', paddingBottom: '12px', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => setSearchParams({ tab: 'queue' })}
          style={{
            padding: '8px 16px',
            borderRadius: '10px',
            border: '2px solid #000814',
            backgroundColor: activeTab === 'queue' ? '#FFC300' : '#FFFFFF',
            boxShadow: activeTab === 'queue' ? '3px 3px 0px 0px #000814' : '2px 2px 0px 0px #000814',
            fontFamily: 'var(--font-heading)',
            fontWeight: 900,
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Clock size={15} />
          <span>Dispatch Queue</span>
          <span style={{ fontSize: '0.72rem', backgroundColor: '#000814', color: '#FFFFFF', padding: '1px 7px', borderRadius: '9999px', fontWeight: 800 }}>
            {countPlaced + countAccepted + countProcessing + countReady}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setSearchParams({ tab: 'orders' })}
          style={{
            padding: '8px 16px',
            borderRadius: '10px',
            border: '2px solid #000814',
            backgroundColor: activeTab === 'orders' ? '#FFC300' : '#FFFFFF',
            boxShadow: activeTab === 'orders' ? '3px 3px 0px 0px #000814' : '2px 2px 0px 0px #000814',
            fontFamily: 'var(--font-heading)',
            fontWeight: 900,
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Layers size={15} />
          <span>All Orders</span>
          <span style={{ fontSize: '0.72rem', backgroundColor: '#000814', color: '#FFFFFF', padding: '1px 7px', borderRadius: '9999px', fontWeight: 800 }}>
            {orders.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setSearchParams({ tab: 'stats' })}
          style={{
            padding: '8px 16px',
            borderRadius: '10px',
            border: '2px solid #000814',
            backgroundColor: activeTab === 'stats' ? '#FFC300' : '#FFFFFF',
            boxShadow: activeTab === 'stats' ? '3px 3px 0px 0px #000814' : '2px 2px 0px 0px #000814',
            fontFamily: 'var(--font-heading)',
            fontWeight: 900,
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <BarChart3 size={15} />
          <span>Statistics &amp; Analytics</span>
        </button>
      </div>

      {activeTab === 'stats' ? (
        /* Dedicated Statistics & Analytics Dashboard */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Key Financial & Volume Metrics */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px',
            }}
          >
            <NeoCard variant="yellow" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 900, fontFamily: 'var(--font-heading)', textTransform: 'uppercase' }}>TOTAL REVENUE</span>
                <IndianRupee size={18} />
              </div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', fontWeight: 900, marginTop: '8px', lineHeight: 1 }}>
                ₹{totalRevenue}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#78350F', marginTop: '6px', fontWeight: 800 }}>
                Today: ₹{todayRevenue}
              </div>
            </NeoCard>

            <NeoCard variant="sky" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 900, fontFamily: 'var(--font-heading)', textTransform: 'uppercase' }}>TOTAL PAGES PRINTED</span>
                <Printer size={18} />
              </div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', fontWeight: 900, marginTop: '8px', lineHeight: 1 }}>
                {totalPages}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#1E3A8A', marginTop: '6px', fontWeight: 800 }}>
                {bwPages} B&amp;W · {colorPages} Color
              </div>
            </NeoCard>

            <NeoCard variant="mint" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 900, fontFamily: 'var(--font-heading)', textTransform: 'uppercase' }}>TOTAL ORDERS</span>
                <Layers size={18} />
              </div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', fontWeight: 900, marginTop: '8px', lineHeight: 1 }}>
                {orders.length}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#14532D', marginTop: '6px', fontWeight: 800 }}>
                {countReady + countCompleted} Completed / Ready
              </div>
            </NeoCard>

            <NeoCard variant="lavender" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 900, fontFamily: 'var(--font-heading)', textTransform: 'uppercase' }}>AVG. PAGES / ORDER</span>
                <TrendingUp size={18} />
              </div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', fontWeight: 900, marginTop: '8px', lineHeight: 1 }}>
                {orders.length ? Math.round(totalPages / orders.length) : 0}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#4338CA', marginTop: '6px', fontWeight: 800 }}>
                Avg cost: ₹{orders.length ? Math.round(totalRevenue / orders.length) : 0}
              </div>
            </NeoCard>
          </div>

          {/* Distribution Sections */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {/* Status Distribution */}
            <NeoCard variant="default" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
                <PieChart size={18} />
                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.1rem', margin: 0 }}>
                  Order Status Breakdown
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { label: 'New / Placed', count: countPlaced, color: '#FEF08A' },
                  { label: 'Accepted', count: countAccepted, color: '#BAE6FD' },
                  { label: 'In Processing', count: countProcessing, color: '#C7D2FE' },
                  { label: 'Ready for Pickup', count: countReady, color: '#BBF7D0' },
                  { label: 'Completed', count: countCompleted, color: '#E2E8F0' },
                  { label: 'Rejected', count: countRejected, color: '#FECACA' },
                ].map((item) => {
                  const pct = orders.length ? Math.round((item.count / orders.length) * 100) : 0;
                  return (
                    <div key={item.label}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '4px' }}>
                        <span>{item.label}</span>
                        <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800 }}>{item.count} ({pct}%)</span>
                      </div>
                      <div style={{ width: '100%', height: '14px', background: '#F1F5F9', borderRadius: '6px', border: '1.5px solid #000814', overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: item.color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </NeoCard>

            {/* Print Preferences Breakdown */}
            <NeoCard variant="default" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
                <BarChart3 size={18} />
                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.1rem', margin: 0 }}>
                  Print Preferences
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '4px' }}>
                    <span>Color Mode</span>
                    <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800 }}>{Math.round((bwPages / (totalPages || 1)) * 100)}% B&amp;W</span>
                  </div>
                  <div style={{ display: 'flex', height: '14px', border: '1.5px solid #000814', borderRadius: '6px', overflow: 'hidden' }}>
                    <div style={{ width: `${Math.round((bwPages / (totalPages || 1)) * 100)}%`, background: '#001D3D' }} title="B&W" />
                    <div style={{ flex: 1, background: '#FFC300' }} title="Color" />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#6B7280', marginTop: '4px', fontWeight: 700 }}>
                    <span>B&amp;W: {bwPages} pages</span>
                    <span>Color: {colorPages} pages</span>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '4px' }}>
                    <span>Payment Method</span>
                    <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800 }}>
                      {Math.round((orders.filter((o) => o.paymentMethod === 'online').length / (orders.length || 1)) * 100)}% Online
                    </span>
                  </div>
                  <div style={{ display: 'flex', height: '14px', border: '1.5px solid #000814', borderRadius: '6px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${Math.round((orders.filter((o) => o.paymentMethod === 'online').length / (orders.length || 1)) * 100)}%`,
                        background: '#10B981',
                      }}
                    />
                    <div style={{ flex: 1, background: '#F59E0B' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#6B7280', marginTop: '4px', fontWeight: 700 }}>
                    <span>Online UPI/Card: {orders.filter((o) => o.paymentMethod === 'online').length}</span>
                    <span>Counter Cash: {orders.filter((o) => o.paymentMethod !== 'online').length}</span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>
                    BINDING DISTRIBUTION
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                    {['none', 'spiral', 'staple', 'hardcover'].map((b) => {
                      const bCount = orders.filter((o) => (o.options?.binding || 'none') === b).length;
                      return (
                        <div key={b} style={{ border: '1.5px solid #000814', padding: '8px 12px', borderRadius: '8px', background: '#F8FAFC', boxShadow: '2px 2px 0px 0px #000814' }}>
                          <div style={{ fontSize: '0.7rem', color: '#6B7280', textTransform: 'uppercase', fontWeight: 800 }}>{b}</div>
                          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.05rem' }}>{bCount} orders</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </NeoCard>
          </div>
        </div>
      ) : (
        /* Queue and Orders Tabs */
        <>
          {/* Top 5 Metric Cards: NEW ORDERS, ACCEPTED, PROCESSING, READY, TODAY'S ORDERS */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '16px',
            }}
          >
            {/* NEW ORDERS */}
            <NeoCard
              variant="yellow"
              style={{
                cursor: 'pointer',
                padding: '18px 20px',
                border: statusFilter === 'placed' ? '3px solid #000814' : '2px solid #000814',
                boxShadow: statusFilter === 'placed' ? '5px 5px 0px 0px #000814' : '3px 3px 0px 0px #000814',
              }}
              onClick={() => setStatusFilter(statusFilter === 'placed' ? '' : 'placed')}
            >
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '0.75rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                NEW ORDERS
              </div>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '2.2rem', marginTop: '4px', lineHeight: 1 }}>
                {countPlaced}
              </div>
            </NeoCard>

            {/* ACCEPTED */}
            <NeoCard
              variant="sky"
              style={{
                cursor: 'pointer',
                padding: '18px 20px',
                border: statusFilter === 'accepted' ? '3px solid #000814' : '2px solid #000814',
                boxShadow: statusFilter === 'accepted' ? '5px 5px 0px 0px #000814' : '3px 3px 0px 0px #000814',
              }}
              onClick={() => setStatusFilter(statusFilter === 'accepted' ? '' : 'accepted')}
            >
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '0.75rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                ACCEPTED
              </div>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '2.2rem', marginTop: '4px', lineHeight: 1 }}>
                {countAccepted}
              </div>
            </NeoCard>

            {/* PROCESSING */}
            <NeoCard
              variant="lavender"
              style={{
                cursor: 'pointer',
                padding: '18px 20px',
                border: statusFilter === 'processing' ? '3px solid #000814' : '2px solid #000814',
                boxShadow: statusFilter === 'processing' ? '5px 5px 0px 0px #000814' : '3px 3px 0px 0px #000814',
              }}
              onClick={() => setStatusFilter(statusFilter === 'processing' ? '' : 'processing')}
            >
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '0.75rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                PROCESSING
              </div>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '2.2rem', marginTop: '4px', lineHeight: 1 }}>
                {countProcessing}
              </div>
            </NeoCard>

            {/* READY */}
            <NeoCard
              variant="mint"
              style={{
                cursor: 'pointer',
                padding: '18px 20px',
                border: statusFilter === 'ready' ? '3px solid #000814' : '2px solid #000814',
                boxShadow: statusFilter === 'ready' ? '5px 5px 0px 0px #000814' : '3px 3px 0px 0px #000814',
              }}
              onClick={() => setStatusFilter(statusFilter === 'ready' ? '' : 'ready')}
            >
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '0.75rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                READY
              </div>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '2.2rem', marginTop: '4px', lineHeight: 1 }}>
                {countReady}
              </div>
            </NeoCard>

            {/* TODAY'S ORDERS */}
            <NeoCard
              variant="default"
              style={{
                cursor: 'pointer',
                padding: '18px 20px',
                border: statusFilter === '' ? '3px solid #000814' : '2px solid #000814',
                boxShadow: statusFilter === '' ? '5px 5px 0px 0px #000814' : '3px 3px 0px 0px #000814',
              }}
              onClick={() => setStatusFilter('')}
            >
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '0.75rem', letterSpacing: '0.04em', textTransform: 'uppercase', color: '#6B7280' }}>
                TODAY'S ORDERS
              </div>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '2.2rem', marginTop: '4px', lineHeight: 1 }}>
                {countToday}
              </div>
            </NeoCard>
          </div>

          {/* Search and Filter Toolbar */}
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
                  border: '2px solid #000814',
                  borderRadius: '12px',
                  boxShadow: '3px 3px 0px 0px #000814',
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
                  border: '2px solid #000814',
                  borderRadius: '12px',
                  boxShadow: '3px 3px 0px 0px #000814',
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
                  border: '2px solid #000814',
                  borderRadius: '12px',
                  boxShadow: '3px 3px 0px 0px #000814',
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

          {/* Queue Table */}
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
              <div style={{ padding: '60px 20px', textAlign: 'center', color: '#6B7280', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <PixelPrinterGraphic size={72} />
                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, color: '#000814', fontSize: '1.1rem' }}>
                  All Clear! No Orders in Queue
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  Incoming print jobs from students will appear here in real time.
                </div>
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
                      {['TOKEN', 'STUDENT', 'FILE', 'PAGES', 'REQ', 'PAYMENT', 'STATUS', 'ETA', 'ACTION'].map((h, i) => (
                        <th
                          key={i}
                          style={{
                            padding: '12px 16px',
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
                                border: '1.5px solid #000814',
                                borderRadius: '9999px',
                                padding: '2px 10px',
                                fontSize: '0.72rem',
                                fontFamily: 'var(--font-heading)',
                                fontWeight: 900,
                                color: '#000814',
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
        </>
      )}

      {/* Selected Order Drawer / Modal with 3D Simulation */}
      {selectedOrder && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 8, 20, 0.75)',
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
              backgroundColor: '#FFFFFF',
              border: '3px solid #000814',
              borderRadius: '16px',
              boxShadow: '8px 8px 0px 0px #000814',
              maxWidth: '920px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '28px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #000814', paddingBottom: '16px', marginBottom: '20px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.5rem', margin: 0 }}>
                    Manage Order {selectedOrder.orderId}
                  </h2>
                  <StatusBadge status={selectedOrder.status} />
                </div>
                <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#6B7280', fontWeight: 600 }}>
                  Submitted by {selectedOrder.userName || selectedOrder.userId}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                style={{
                  background: '#FFFFFF',
                  border: '2px solid #000814',
                  borderRadius: '8px',
                  padding: '6px',
                  cursor: 'pointer',
                  boxShadow: '2px 2px 0px 0px #000814',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Grid: Left Details & Right Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
              {/* Order Meta Info */}
              <NeoCard variant="default" style={{ padding: '18px' }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '0.82rem', color: '#6B7280', textTransform: 'uppercase', marginBottom: '12px' }}>
                  DOCUMENT DETAILS
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#4B5563', fontWeight: 600 }}>File:</span>
                    <span style={{ fontWeight: 800 }}>{selectedOrder.fileName}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#4B5563', fontWeight: 600 }}>Pages:</span>
                    <span style={{ fontWeight: 800 }}>{selectedOrder.pages}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#4B5563', fontWeight: 600 }}>Copies:</span>
                    <span style={{ fontWeight: 800 }}>{selectedOrder.copies}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#4B5563', fontWeight: 600 }}>Print Mode:</span>
                    <span style={{ fontWeight: 800 }}>{selectedOrder.options?.colorMode === 'color' ? 'Full Color' : 'B&W'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#4B5563', fontWeight: 600 }}>Sides:</span>
                    <span style={{ fontWeight: 800 }}>{selectedOrder.options?.sided === 'double' ? 'Double Sided' : 'Single Sided'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#4B5563', fontWeight: 600 }}>Binding:</span>
                    <span style={{ fontWeight: 800, textTransform: 'capitalize' }}>{selectedOrder.options?.binding || 'none'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#4B5563', fontWeight: 600 }}>Total Price:</span>
                    <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.1rem', color: '#000814' }}>
                      ₹{selectedOrder.cost?.total || selectedOrder.cost || 0}
                    </span>
                  </div>
                </div>

                <div style={{ marginTop: '14px', display: 'flex', gap: '8px' }}>
                  <a
                    href={api.staffFileUrl(selectedOrder.orderId)}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '2px solid #000814',
                      backgroundColor: '#FFFFFF',
                      boxShadow: '2px 2px 0px 0px #000814',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 800,
                      fontSize: '0.8rem',
                      color: '#000814',
                      textDecoration: 'none',
                    }}
                  >
                    <Download size={14} />
                    <span>Download PDF</span>
                  </a>
                </div>
              </NeoCard>

              {/* Status Control Actions */}
              <NeoCard variant="default" style={{ padding: '18px' }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '0.82rem', color: '#6B7280', textTransform: 'uppercase', marginBottom: '12px' }}>
                  STATUS WORKFLOW TRANSITIONS
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
                        <span>ACCEPT ORDER (START QUEUE)</span>
                      </NeoButton>

                      <NeoButton
                        variant="danger"
                        size="sm"
                        disabled={updating}
                        onClick={() => setRejectModalOpen(true)}
                        style={{ width: '100%' }}
                      >
                        <X size={16} />
                        <span>REJECT ORDER</span>
                      </NeoButton>
                    </>
                  )}

                  {selectedOrder.status === 'accepted' && (
                    <NeoButton
                      variant="primary"
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
                        border: '1.5px solid #000814',
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
                border: '2px solid #000814',
                borderRadius: '10px',
                padding: '10px 12px',
                fontFamily: 'var(--font-body)',
                fontSize: '0.88rem',
                resize: 'none',
                outline: 'none',
                backgroundColor: '#FFFFFF',
                boxShadow: '2px 2px 0px 0px #000814',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '18px' }}>
              <button
                type="button"
                onClick={() => setRejectModalOpen(false)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '10px',
                  border: '2px solid #000814',
                  backgroundColor: '#FFFFFF',
                  boxShadow: '2px 2px 0px 0px #000814',
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
                disabled={!rejectReason.trim()}
                onClick={() => handleStatusChange(selectedOrder.orderId, 'rejected', rejectReason)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '10px',
                  border: '2px solid #000814',
                  backgroundColor: '#FECACA',
                  boxShadow: '2px 2px 0px 0px #000814',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 900,
                  fontSize: '0.85rem',
                  cursor: rejectReason.trim() ? 'pointer' : 'not-allowed',
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
