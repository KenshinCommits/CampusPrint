import { useEffect, useState } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';
import { CheckCircle2, ArrowRight, Printer, Sparkles, RefreshCw, FileText } from 'lucide-react';

export function OrderSuccess() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    if (!order && id) {
      api
        .getOrder(id)
        .then((data) => setOrder(data.order))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [id, order]);

  async function handleSimulatedPayment() {
    if (!order) return;
    setPaying(true);
    try {
      const res = await api.payOrder(order.orderId);
      setOrder(res.order);
    } catch (err) {
      alert(err.message || 'Payment simulation failed');
    } finally {
      setPaying(false);
    }
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '60px' }}>Loading order details…</div>;
  }

  const token = order?.orderId || id || 'CP-1001';
  const isPaid = order?.paymentStatus === 'paid';

  return (
    <div style={{ maxWidth: '820px', margin: '30px auto' }}>
      <div className="neo-card" style={{ padding: '36px 30px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.1fr 0.9fr',
            gap: '36px',
            alignItems: 'center',
          }}
          className="success-grid"
        >
          {/* Left Column: Big Celebratory Badge + Token */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '20px' }}>
            {/* Green Checkmark Circle */}
            <div
              style={{
                width: '74px',
                height: '74px',
                background: '#86EFAC',
                border: '3px solid #000',
                borderRadius: '50%',
                boxShadow: '3px 3px 0px #000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CheckCircle2 size={44} strokeWidth={2.5} color="#000" />
            </div>

            <div>
              <h1
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.8rem',
                  fontWeight: 900,
                  letterSpacing: '-0.02em',
                }}
              >
                {isPaid ? 'PAYMENT SUCCESSFUL!' : 'ORDER PLACED!'}
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '6px' }}>
                {isPaid
                  ? 'Your order has been paid and added to the queue.'
                  : 'Your print order is queued. Pay at counter or right now.'}
              </p>
            </div>

            {/* Neo-brutalist Yellow Ticket */}
            <div
              style={{
                background: '#FFD028',
                border: '3px solid #000',
                borderRadius: '10px',
                boxShadow: '4px 4px 0px #000',
                padding: '18px 36px',
                position: 'relative',
                width: '100%',
                maxWidth: '300px',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '2.4rem',
                  fontWeight: 900,
                  letterSpacing: '0.04em',
                }}
              >
                {token}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginTop: '2px',
                }}
              >
                YOUR PRINT TOKEN
              </div>
            </div>

            {!isPaid && (
              <button
                type="button"
                className="neo-btn success sm"
                onClick={handleSimulatedPayment}
                disabled={paying}
              >
                <Sparkles size={16} />
                <span>{paying ? 'Processing…' : `Pay ₹${order?.cost?.total || 0} Online Now`}</span>
              </button>
            )}
          </div>

          {/* Right Column: Order Summary Receipt */}
          <div
            style={{
              background: '#FFFDF9',
              border: '2px solid #000',
              borderRadius: '8px',
              boxShadow: '2px 2px 0px #000',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.85rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--text-muted)',
              }}
            >
              ORDER SUMMARY
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span>
                {order?.pages || 1} pages × {order?.options?.copies || 1} copies
              </span>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
                ₹{order?.cost?.printCost || 0}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ textTransform: 'capitalize' }}>
                Binding ({order?.options?.binding || 'None'})
              </span>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
                ₹{order?.cost?.bindingCost || 0}
              </span>
            </div>

            <div style={{ borderTop: '2px dashed #000', margin: '4px 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 900 }}>
                Total
              </span>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 900 }}>
                ₹{order?.cost?.total || 0}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Payment Status
              </span>
              <span className={`neo-badge ${isPaid ? 'paid' : 'unpaid'}`}>
                {isPaid ? 'PAID' : 'PENDING'}
              </span>
            </div>

            <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link to={`/order/${token}`} className="neo-btn primary full-width">
                <span>TRACK ORDER</span>
                <ArrowRight size={18} strokeWidth={2.5} />
              </Link>
              <Link to="/order" className="neo-btn full-width" style={{ textAlign: 'center' }}>
                + Place Another Order
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
