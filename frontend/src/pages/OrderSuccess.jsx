import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';
import { PixelDoc, PixelSparkles } from '../components/PixelArt.jsx';
import { NeoCard, NeoButton } from '../components/ui/index.js';
import { CheckCircle2, ArrowRight, FileText, Clock, CreditCard, Sparkles } from 'lucide-react';

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
        backgroundColor: '#001D3D',
        borderRadius: '24px',
        border: '2px solid #000000',
        padding: 'clamp(36px, 6vw, 64px) 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '6px 6px 0px 0px #000000',
      }}
    >
      {/* Corner Pixel Sparkles */}
      <div style={{ position: 'absolute', top: '24px', left: '24px' }}>
        <PixelSparkles color1="#FFC300" color2="#38BDF8" />
      </div>
      <div style={{ position: 'absolute', top: '24px', right: '24px' }}>
        <PixelSparkles color1="#38BDF8" color2="#FFC300" />
      </div>

      <div
        style={{
          maxWidth: '520px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '24px',
          zIndex: 2,
        }}
      >
        {/* Header: Success checkmark badge and "ORDER PLACED!" heading */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              backgroundColor: '#BBF7D0',
              border: '2px solid #000000',
              borderRadius: '9999px',
              padding: '6px 16px',
              boxShadow: '2px 2px 0px 0px #000000',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'var(--font-heading)',
              fontWeight: 900,
              fontSize: '0.8rem',
              color: '#000000',
            }}
          >
            <CheckCircle2 size={16} color="#000000" strokeWidth={3} />
            <span>SUBMISSION SUCCESSFUL</span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.2rem, 4.5vw, 2.8rem)',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              color: '#FFFFFF',
              margin: 0,
              textTransform: 'uppercase',
            }}
          >
            ORDER PLACED!
          </h1>
        </div>

        {/* Ticket Box: Yellow dashed-border container (border-2 border-dashed border-black bg-[#FEF08A] p-6 rounded-2xl text-center) */}
        <div
          style={{
            width: '100%',
            backgroundColor: '#FEF08A',
            border: '2px dashed #000000',
            borderRadius: '16px', // rounded-2xl
            padding: '24px 20px',
            textAlign: 'center',
            boxShadow: '4px 4px 0px 0px #000000',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {/* Token: Giant bold text "CP-1042" with subtitle "PRINT #42" */}
          <div
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.6rem, 6vw, 3.6rem)',
              fontWeight: 900,
              letterSpacing: '-0.01em',
              color: '#000000',
              lineHeight: 1,
            }}
          >
            {token}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 900,
              fontSize: '0.9rem',
              letterSpacing: '0.1em',
              color: '#000000',
              backgroundColor: '#FFC300',
              border: '1.5px solid #000000',
              borderRadius: '6px',
              padding: '2px 10px',
            }}
          >
            PRINT {tokenNum}
          </div>
        </div>

        {/* Spec details: 2-column grid showing File name, Print Details, Total cost, and Estimated Ready Time */}
        <NeoCard
          variant="default"
          style={{
            width: '100%',
            padding: '20px 24px',
            textAlign: 'left',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px',
            }}
          >
            {/* 1. File Name */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-heading)', fontWeight: 900, color: '#6B7280', textTransform: 'uppercase' }}>
                File Name
              </span>
              <span
                style={{
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  color: '#000000',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {order?.fileName || 'document.pdf'}
              </span>
            </div>

            {/* 2. Print Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-heading)', fontWeight: 900, color: '#6B7280', textTransform: 'uppercase' }}>
                Print Details
              </span>
              <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#000000' }}>
                {order?.pages || 1}p · {order?.options?.colorMode === 'color' ? 'Color' : 'B&W'} · {order?.options?.sided || 'Double'}
              </span>
            </div>

            {/* 3. Total Cost */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-heading)', fontWeight: 900, color: '#6B7280', textTransform: 'uppercase' }}>
                Total Cost
              </span>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.2rem', color: '#000000' }}>
                ₹{order?.cost?.total || 14}
              </span>
            </div>

            {/* 4. Estimated Ready Time */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-heading)', fontWeight: 900, color: '#6B7280', textTransform: 'uppercase' }}>
                Estimated Ready Time
              </span>
              <span style={{ fontWeight: 900, fontSize: '0.95rem', color: '#0D9488' }}>
                ~10-15 minutes
              </span>
            </div>
          </div>
        </NeoCard>

        {/* Bottom Button: "TRACK ORDER ->" with yellow fill and hard black shadow */}
        <button
          type="button"
          onClick={() => navigate(`/order/${token}`)}
          style={{
            width: '100%',
            backgroundColor: '#FFC300',
            color: '#000000',
            fontFamily: 'var(--font-heading)',
            fontWeight: 900,
            fontSize: '1.1rem',
            textTransform: 'uppercase',
            padding: '14px',
            borderRadius: '12px',
            border: '2px solid #000000',
            boxShadow: '4px 4px 0px 0px #000000',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            transition: 'transform 0.08s ease, box-shadow 0.08s ease',
          }}
        >
          <span>TRACK ORDER &rarr;</span>
          <ArrowRight size={20} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}

export default OrderSuccess;
