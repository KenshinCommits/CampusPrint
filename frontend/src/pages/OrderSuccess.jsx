import { useEffect, useState } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';
import { PixelDoc, PixelSparkles } from '../components/PixelArt.jsx';
import { ArrowRight, FileText, Clock } from 'lucide-react';

export function OrderSuccess() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    if (!order && id) {
      api
        .getOrder(id)
        .then((data) => setOrder(data.order))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [id, order]);

  const token = order?.orderId || id || 'CP-1042';
  const tokenNum = token.replace(/\D/g, '') ? `#${parseInt(token.replace(/\D/g, ''), 10) % 100}` : '#42';

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 120px)',
        background: '#0B132B',
        borderRadius: '16px',
        border: '3px solid #000',
        padding: 'clamp(32px, 5vw, 60px) 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '6px 6px 0px #000',
      }}
    >
      {/* Corner Pixel Sparkles */}
      <div style={{ position: 'absolute', top: '24px', left: '24px' }}>
        <PixelSparkles color1="#FFD028" color2="#38BDF8" />
      </div>
      <div style={{ position: 'absolute', top: '24px', right: '24px' }}>
        <PixelSparkles color1="#38BDF8" color2="#FFD028" />
      </div>

      <div
        style={{
          maxWidth: '480px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '24px',
          zIndex: 2,
        }}
      >
        {/* Document with blue arrow icon */}
        <PixelDoc size={68} />

        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2rem, 4vw, 2.6rem)',
            fontWeight: 900,
            letterSpacing: '-0.02em',
            color: '#FFFFFF',
            margin: 0,
          }}
        >
          ORDER PLACED!
        </h1>

        {/* Massive Yellow Ticket with Dashed Border */}
        <div
          style={{
            width: '100%',
            background: '#FFD028',
            border: '2.5px dashed #000',
            borderRadius: '12px',
            padding: '24px 20px',
            boxShadow: '4px 4px 0px #000',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.4rem, 5vw, 3.2rem)',
              fontWeight: 900,
              letterSpacing: '0.02em',
              color: '#000',
              lineHeight: 1,
            }}
          >
            {token}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: '0.85rem',
              letterSpacing: '0.08em',
              color: '#1E293B',
            }}
          >
            PRINT {tokenNum}
          </div>
        </div>

        {/* White Receipt Card */}
        <div
          className="neo-card"
          style={{
            width: '100%',
            background: '#FFFFFF',
            padding: '20px 24px',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>File</span>
            <span style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileText size={14} color="#DC2626" />
              <span>{order?.fileName || 'assignment.pdf'}</span>
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Print Details</span>
            <span style={{ fontWeight: 700 }}>
              {order?.pages || 1} {order?.pages === 1 ? 'page' : 'pages'} ·{' '}
              {order?.options?.colorMode === 'color' ? 'Color' : 'B&W'} ·{' '}
              {order?.options?.sided === 'double' ? 'Double-sided' : 'Single'}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Total</span>
            <span style={{ fontWeight: 900, fontSize: '1.05rem' }}>
              ₹{order?.cost?.total || 8}
            </span>
          </div>

          <div style={{ borderTop: '2px dashed #000', margin: '2px 0' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-muted)' }}>Estimated Ready</span>
            <span style={{ fontWeight: 800, color: '#166534', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={14} />
              <span>~5-10 min</span>
            </span>
          </div>
        </div>

        {/* Wide Yellow Track Order Button */}
        <Link
          to={`/order/${token}`}
          className="neo-btn primary full-width"
          style={{
            padding: '14px',
            fontSize: '1rem',
            boxShadow: '4px 4px 0px #000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <span>TRACK ORDER</span>
          <ArrowRight size={18} strokeWidth={2.5} />
        </Link>
      </div>
    </div>
  );
}
