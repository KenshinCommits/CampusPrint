import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../api/client.js';
import { 
  Check, 
  Clock, 
  FileText, 
  AlertCircle, 
  ArrowLeft, 
  CreditCard, 
  XCircle, 
  Sparkles, 
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { PrinterDemo } from '../components/PrinterDemo.jsx';
import { PixelSpeedWatch, PixelTicketGraphic } from '../components/PixelArt.jsx';

const STATUS_STEPS = [
  { key: 'placed', label: 'ORDER PLACED' },
  { key: 'accepted', label: 'ACCEPTED' },
  { key: 'processing', label: 'PROCESSING' },
  { key: 'ready', label: 'READY FOR PICKUP' },
  { key: 'completed', label: 'COMPLETED' },
];

export function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  // Fast-Forward Hackathon Demo Progression State
  const [simulatedStatus, setSimulatedStatus] = useState(null);
  const [simulatedTimes, setSimulatedTimes] = useState({});
  const [isDemoActive, setIsDemoActive] = useState(false);
  const demoTimersRef = useRef([]);
  const hasAutoStartedRef = useRef(false);
  const printerDemoRef = useRef(null);

  function loadOrder() {
    api
      .getOrder(id)
      .then((data) => setOrder(data.order))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadOrder();
    const interval = setInterval(() => {
      // Don't overwrite simulated status during active demo progression
      if (!isDemoActive) {
        loadOrder();
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [id, isDemoActive]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      demoTimersRef.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  /**
   * Fast-Forward Demo Progression:
   * 0s: Step 1 (PLACED) -> badge shows "Order Placed"
   * 1.5s: Step 2 (ACCEPTED) -> badge turns blue "Accepted by Shop"
   * 3.0s: Step 3 (PROCESSING) -> badge turns yellow "Printing in Progress", 3D simulation starts printing & vibrating
   * 3.5s - 5.5s: Paper emerges from slit onto catch tray
   * 6.0s: Step 4 (READY FOR PICKUP) -> badge turns green "Ready for Pickup", 3D simulation "PRINT COMPLETE", estimated time "READY NOW!"
   */
  const startDemoProgression = useCallback(
    (isReplay = false) => {
      // Clear existing timers
      demoTimersRef.current.forEach((t) => clearTimeout(t));
      demoTimersRef.current = [];

      setIsDemoActive(true);
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // 0.0s: Step 1 (PLACED)
      setSimulatedStatus('placed');
      setSimulatedTimes({ placed: nowStr });

      // 1.5s: Step 2 (ACCEPTED)
      const t1 = setTimeout(() => {
        setSimulatedStatus('accepted');
        setSimulatedTimes((prev) => ({
          ...prev,
          accepted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }));
      }, 1500);
      demoTimersRef.current.push(t1);

      // 3.0s: Step 3 (PROCESSING)
      const t2 = setTimeout(() => {
        setSimulatedStatus('processing');
        setSimulatedTimes((prev) => ({
          ...prev,
          processing: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }));
        if (printerDemoRef.current?.printPaper) {
          printerDemoRef.current.printPaper();
        }
      }, 3000);
      demoTimersRef.current.push(t2);

      // 6.0s: Step 4 (READY FOR PICKUP)
      const t3 = setTimeout(() => {
        setSimulatedStatus('ready');
        setSimulatedTimes((prev) => ({
          ...prev,
          ready: 'READY NOW!',
        }));
        setIsDemoActive(false);
      }, 6000);
      demoTimersRef.current.push(t3);
    },
    []
  );

  // Auto-start progression after 2 seconds on tracking page
  useEffect(() => {
    if (order && !hasAutoStartedRef.current && !loading) {
      hasAutoStartedRef.current = true;
      if (order.status === 'placed' || !order.status) {
        const autoTimer = setTimeout(() => {
          startDemoProgression(false);
        }, 2000);
        demoTimersRef.current.push(autoTimer);
      }
    }
  }, [order, loading, startDemoProgression]);

  async function handlePay() {
    setBusy(true);
    try {
      const res = await api.payOrder(id);
      setOrder(res.order);
    } catch (err) {
      alert(err.message || 'Payment simulation failed');
    } finally {
      setBusy(false);
    }
  }

  async function handleCancel() {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    setBusy(true);
    try {
      const res = await api.cancelOrder(id);
      setOrder(res.order);
    } catch (err) {
      alert(err.message || 'Failed to cancel order');
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '60px' }}>Loading order status…</div>;
  }

  if (error || !order) {
    return (
      <div className="neo-card" style={{ maxWidth: '500px', margin: '40px auto', textAlign: 'center' }}>
        <AlertCircle size={40} color="#DC2626" style={{ margin: '0 auto 12px' }} />
        <h2>Order Not Found</h2>
        <p style={{ color: 'var(--text-muted)', margin: '10px 0 20px' }}>{error || 'Unable to load order.'}</p>
        <Link to="/orders" className="neo-btn primary sm">
          Back to Orders
        </Link>
      </div>
    );
  }

  // Active status (combines actual order status with fast demo progression)
  const currentStatus = simulatedStatus || order.status;
  const currentIndex = STATUS_STEPS.findIndex((s) => s.key === currentStatus);
  const isRejected = currentStatus === 'rejected';
  const isCancelled = currentStatus === 'cancelled';
  const isPaid = order.paymentStatus === 'paid';

  function getStepTime(stepKey) {
    if (simulatedTimes[stepKey]) return simulatedTimes[stepKey];
    const historyItem = (order.statusHistory || []).find((h) => h.status === stepKey);
    if (!historyItem?.at) {
      if (stepKey === 'ready' && currentIndex >= 2) return currentStatus === 'ready' ? 'READY NOW!' : '~12 min';
      return '';
    }
    const d = new Date(historyItem.at);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Status Badge Label & Color mapping
  function renderStatusBadge() {
    if (currentStatus === 'processing') {
      return (
        <span
          className="neo-badge processing"
          style={{
            fontSize: '0.88rem',
            padding: '6px 14px',
            background: '#FEF08A',
            color: '#854D0E',
            border: '2px solid #000',
          }}
        >
          Printing in Progress
        </span>
      );
    }
    if (currentStatus === 'accepted') {
      return (
        <span
          className="neo-badge accepted"
          style={{
            fontSize: '0.88rem',
            padding: '6px 14px',
            background: '#BFDBFE',
            color: '#1E3A8A',
            border: '2px solid #000',
          }}
        >
          Accepted by Shop
        </span>
      );
    }
    if (currentStatus === 'ready') {
      return (
        <span
          className="neo-badge ready"
          style={{
            fontSize: '0.88rem',
            padding: '6px 14px',
            background: '#86EFAC',
            color: '#14532D',
            border: '2px solid #000',
          }}
        >
          Ready for Pickup
        </span>
      );
    }
    if (currentStatus === 'completed') {
      return (
        <span
          className="neo-badge completed"
          style={{
            fontSize: '0.88rem',
            padding: '6px 14px',
            background: '#E5E7EB',
            color: '#111',
            border: '2px solid #000',
          }}
        >
          Order Completed
        </span>
      );
    }
    return (
      <span
        className="neo-badge placed"
        style={{
          fontSize: '0.88rem',
          padding: '6px 14px',
          background: 'var(--yellow-primary)',
          color: '#000',
          border: '2px solid #000',
        }}
      >
        Order Placed
      </span>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Back button + Header */}
      <div>
        <Link
          to="/orders"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontFamily: 'var(--font-heading)',
            fontWeight: 700,
            fontSize: '0.85rem',
            color: '#000',
            marginBottom: '10px',
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to all orders</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                margin: 0,
              }}
            >
              ORDER {order.orderId}
            </h1>

            {renderStatusBadge()}
          </div>

          {/* Replay Fast-Forward Demo Action */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              className="neo-btn sm"
              onClick={() => startDemoProgression(true)}
              title="Re-run 0s → 6s automated timeline progression with 3D printer hardware"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#FFC300',
                boxShadow: '2px 2px 0px #000',
                border: '2px solid #000',
                fontWeight: 900,
                textTransform: 'uppercase',
                borderRadius: '10px',
              }}
            >
              <Sparkles size={14} />
              <span>Replay Fast-Forward Demo</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5-Step Horizontal Timeline Card */}
      {!isRejected && !isCancelled ? (
        <div className="neo-card timeline-container">
          <div className="timeline-steps">
            <div className="timeline-track-bg" />
            <div
              className="timeline-track-fill"
              style={{
                width: `${Math.max(0, Math.min(100, (currentIndex / (STATUS_STEPS.length - 1)) * 100))}%`,
              }}
            />

            {STATUS_STEPS.map((step, idx) => {
              const isDone = currentIndex > idx || currentStatus === 'completed';
              const isCurrent = currentIndex === idx;
              const time = getStepTime(step.key);

              return (
                <div
                  key={step.key}
                  className={`timeline-step ${isDone ? 'completed' : ''} ${isCurrent ? 'active' : ''}`}
                >
                  <div className="step-circle">
                    {isDone ? (
                      <Check size={18} strokeWidth={3} />
                    ) : (
                      <span>{idx + 1}</span>
                    )}
                  </div>
                  <div className="step-label">{step.label}</div>
                  {time && <div className="step-time">{time}</div>}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div
          style={{
            background: '#FEE2E2',
            border: '2px solid #EF4444',
            borderRadius: '8px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <XCircle size={24} color="#DC2626" />
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, color: '#991B1B' }}>
              ORDER {currentStatus.toUpperCase()}
            </div>
            {order.rejectionReason && (
              <div style={{ fontSize: '0.88rem', color: '#B91C1C', marginTop: '2px' }}>
                Reason: {order.rejectionReason}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3D Physical Hardware Simulator (Directly wired to timeline) */}
      {!isCancelled && !isRejected && (
        <PrinterDemo
          ref={printerDemoRef}
          pdfUrl={api.orderFileUrl(order.orderId)}
          order={order}
          orderStatus={currentStatus}
          onTriggerDemo={() => startDemoProgression(true)}
          title={
            currentStatus === 'processing'
              ? 'Physical Print Simulation (In Progress)'
              : currentStatus === 'ready' || currentStatus === 'completed'
              ? 'Hardware Simulation (Sheet Ready on Tray)'
              : 'Interactive 3D Hardware Simulation'
          }
          height="420px"
        />
      )}

      {/* Two Column Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.8fr',
          gap: '24px',
          alignItems: 'start',
        }}
        className="order-detail-grid"
      >
        {/* Left Column: Order Details */}
        <div className="neo-card">
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.1rem',
              fontWeight: 800,
              marginBottom: '16px',
              letterSpacing: '0.02em',
            }}
          >
            ORDER DETAILS
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.92rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>File name</span>
              <span style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileText size={15} color="#DC2626" />
                {order.fileName}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Pages</span>
              <span style={{ fontWeight: 700 }}>{order.pages}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Copies</span>
              <span style={{ fontWeight: 700 }}>{order.options?.copies || 1}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Print settings</span>
              <span style={{ fontWeight: 700, textAlign: 'right' }}>
                {order.options?.colorMode === 'color' ? 'Color' : 'B&W'} ·{' '}
                {order.options?.sided === 'double' ? 'Double-sided' : 'Single'} ·{' '}
                {order.options?.paperSize || 'A4'} ·{' '}
                {order.options?.binding === 'none' ? 'No binding' : order.options?.binding || 'None'}
              </span>
            </div>

            {order.options?.notes && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Notes</span>
                <span style={{ fontWeight: 600, fontStyle: 'italic', maxWidth: '240px', textAlign: 'right' }}>
                  "{order.options.notes}"
                </span>
              </div>
            )}

            <div style={{ borderTop: '2px dashed #000', margin: '4px 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-muted)' }}>Payment status</span>
              <span className={`neo-badge ${isPaid ? 'paid' : 'unpaid'}`}>
                {isPaid ? 'PAID' : 'UNPAID'}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.05rem' }}>
                Total Amount
              </span>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.3rem' }}>
                ₹{order.cost?.total || 0}
              </span>
            </div>
          </div>

          {currentStatus === 'placed' && (
            <div style={{ marginTop: '20px', borderTop: '2px solid #E5E7EB', paddingTop: '16px' }}>
              <button
                type="button"
                className="neo-btn danger sm"
                disabled={busy}
                onClick={handleCancel}
              >
                Cancel Order
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Estimated Ready Time & Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="neo-card" style={{ background: '#FFFDF9' }}>
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.78rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                letterSpacing: '0.04em',
                marginBottom: '10px',
              }}
            >
              ESTIMATED READY TIME
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <div style={{ filter: 'drop-shadow(2px 2px 0px #000000)' }}>
                <PixelSpeedWatch size={48} />
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.8rem',
                  fontWeight: 900,
                  color: currentStatus === 'ready' ? '#166534' : '#000',
                }}
              >
                {currentStatus === 'ready'
                  ? 'READY NOW!'
                  : currentStatus === 'completed'
                  ? 'COMPLETED'
                  : currentStatus === 'processing'
                  ? '~1-2 MIN'
                  : currentStatus === 'accepted'
                  ? '~5-10 MIN'
                  : '~15-20 MIN'}
              </div>
            </div>

            {/* If Ready: Manual "Complete Order" Button */}
            {currentStatus === 'ready' ? (
              <button
                type="button"
                className="neo-btn sm dark full-width"
                onClick={() => setSimulatedStatus('completed')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  background: '#166534',
                  color: '#FFFFFF',
                  marginBottom: '10px',
                }}
              >
                <CheckCircle2 size={16} />
                <span>COLLECT DOCUMENT (COMPLETE)</span>
              </button>
            ) : currentStatus === 'completed' ? (
              <button
                type="button"
                className="neo-btn sm full-width"
                onClick={() => startDemoProgression(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  background: '#F1F5F9',
                  marginBottom: '10px',
                }}
              >
                <RotateCcw size={15} />
                <span>Replay Hackathon Demo</span>
              </button>
            ) : null}

            <button
              type="button"
              className="neo-btn sm blue full-width"
              onClick={() => alert(`Your order ${order.orderId} is currently #${currentIndex >= 2 ? 1 : 2} in line at the counter!`)}
            >
              VIEW QUEUE POSITION
            </button>
          </div>

          {!isPaid && !isCancelled && !isRejected && (
            <div className="neo-card" style={{ background: '#FFFDEB' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <CreditCard size={18} />
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '0.9rem' }}>
                  Simulated Online Payment
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                Pay digitally to skip counter cash handling.
              </p>
              <button
                type="button"
                className="neo-btn primary full-width"
                disabled={busy}
                onClick={handlePay}
              >
                <span>{busy ? 'Processing…' : `PAY NOW (₹${order.cost?.total || 0})`}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
