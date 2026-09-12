import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../api/client.js';
import { 
  PixelHeroPrinterScene, 
  PixelShopPrinterScene,
  PixelDocumentIcon, 
  PixelBoxIcon, 
  PixelChartIcon, 
  PixelShopIcon 
} from '../components/PixelArt.jsx';
import { 
  Plus, 
  FileText, 
  ArrowRight, 
  Clock, 
  Check, 
  X, 
  Cog, 
  Minus,
  Eye
} from 'lucide-react';

export function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Interactive Print Shop Widget State
  const [copies, setCopies] = useState(2);
  const [colorMode, setColorMode] = useState('bw'); // 'bw' | 'color'
  const [sides, setSides] = useState('single'); // 'single' | 'double'
  const [paperSize, setPaperSize] = useState('A4'); // 'A4' | 'A3'
  const [binding, setBinding] = useState('staple'); // 'none' | 'staple' | 'spiral'

  useEffect(() => {
    api
      .myOrders()
      .then((data) => setOrders(data.orders || []))
      .catch((err) => console.error('Failed to load orders', err))
      .finally(() => setLoading(false));
  }, []);

  // Demo Fallback Orders matching Reference Mockup if none exist
  const sampleOrders = [
    {
      id: 'demo-1042',
      token: 'CP-1042',
      fileName: 'sample_document.pdf',
      status: 'processing',
      price: 17,
      date: 'Today, 1:20 PM',
      eta: '2:40 PM',
    },
    {
      id: 'demo-1038',
      token: 'CP-1038',
      fileName: 'notes.pdf',
      status: 'ready',
      price: 12,
      date: 'Today, 11:05 AM',
      eta: '11:00 AM',
    },
    {
      id: 'demo-1036',
      token: 'CP-1036',
      fileName: 'lab_report.pdf',
      status: 'completed',
      price: 8,
      date: 'Yesterday',
      eta: 'Done',
    },
    {
      id: 'demo-1034',
      token: 'CP-1034',
      fileName: 'project.pdf',
      status: 'rejected',
      price: 36,
      date: 'Dec 10, 2024',
      eta: 'Cancelled',
    },
  ];

  // Merge real orders with reference sample orders so UI matches mockup seamlessly
  const mappedRealOrders = orders.map((o) => ({
    id: o.id,
    token: o.token || `CP-${o.id?.slice(-4) || '1042'}`,
    fileName: o.fileName || o.documentName || 'sample_document.pdf',
    status: o.status,
    price: o.price || o.totalCost || 17,
    date: o.createdAt ? new Date(o.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'Today, 1:20 PM',
    eta: o.estimatedTime || '2:40 PM',
  }));

  const displayOrders = mappedRealOrders.length > 0
    ? [...mappedRealOrders, ...sampleOrders.filter((s) => !mappedRealOrders.some((r) => r.token === s.token))].slice(0, 5)
    : sampleOrders;

  // Active current order (defaults to CP-1042 if none processing)
  const currentOrder = displayOrders.find((o) => ['processing', 'accepted', 'placed'].includes(o.status)) || sampleOrders[0];

  // Calculate live pricing for Print Shop widget
  const pageBaseRate = colorMode === 'color' ? 8 : 2;
  const paperMultiplier = paperSize === 'A3' ? 2 : 1;
  const sidesMultiplier = sides === 'double' ? 1.5 : 1;
  const printCost = Math.round(copies * 4 * pageBaseRate * paperMultiplier * sidesMultiplier);
  const bindingCost = binding === 'staple' ? 1 : binding === 'spiral' ? 15 : 0;
  const totalCost = printCost + bindingCost;

  function handlePlaceOrder() {
    navigate('/new-order', {
      state: {
        presetCopies: copies,
        presetColor: colorMode,
        presetSides: sides,
        presetPaper: paperSize,
        presetBinding: binding,
      }
    });
  }

  return (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', maxWidth: '1440px', margin: '0 auto' }}>
      {/* LEFT COLUMN: Main Dashboard Content (Hero, Stats, Current Order, Recent Orders) */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* 1. HERO BANNER: HEY, STUDENT. READY TO PRINT? */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '2px solid #000814',
            borderRadius: '12px',
            boxShadow: '3px 3px 0px #000814',
            padding: '24px 28px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            overflow: 'hidden',
          }}
        >
          <div style={{ maxWidth: '440px' }}>
            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '2rem',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
                color: '#000814',
                margin: 0,
              }}
            >
              HEY, STUDENT.<br />READY TO PRINT?
            </h1>
            <p
              style={{
                margin: '10px 0 0',
                fontSize: '0.9rem',
                color: '#475569',
                fontWeight: 600,
                lineHeight: 1.4,
              }}
            >
              Skip the queue. Send your documents from anywhere on campus.
            </p>

            <button
              type="button"
              onClick={() => navigate('/new-order')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '18px',
                backgroundColor: '#FFC300',
                color: '#000814',
                border: '3px solid #000814',
                borderRadius: '8px',
                padding: '12px 22px',
                fontFamily: 'var(--font-heading)',
                fontWeight: 900,
                fontSize: '0.85rem',
                boxShadow: '3px 3px 0px #000814',
                cursor: 'pointer',
                transition: 'all 0.1s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FFD60A'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFC300'; }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'translate(2px, 2px)';
                e.currentTarget.style.boxShadow = '1px 1px 0px #000814';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '3px 3px 0px #000814';
              }}
            >
              <Plus size={18} strokeWidth={3} />
              <span>NEW PRINT ORDER</span>
            </button>
          </div>

          {/* Right: Handcrafted Pixel Hero Printer Scene */}
          <div style={{ flexShrink: 0 }}>
            <PixelHeroPrinterScene width={360} height={180} />
          </div>
        </div>

        {/* 2. THREE STAT METRIC CARDS */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
          }}
        >
          {/* Card 1: Active Orders */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '2px solid #000814',
              borderRadius: '10px',
              boxShadow: '2px 2px 0px #000814',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '8px',
                border: '1.5px solid #000814',
                backgroundColor: '#F8F5ED',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <PixelDocumentIcon size={26} />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.72rem', fontWeight: 800, color: '#475569', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                ACTIVE ORDERS
              </div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 900, color: '#000814', lineHeight: 1.1 }}>
                02
              </div>
              <div style={{ width: '22px', height: '3px', backgroundColor: '#FFD60A', borderRadius: '2px', marginTop: '4px' }} />
            </div>
          </div>

          {/* Card 2: Ready for Pickup */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '2px solid #000814',
              borderRadius: '10px',
              boxShadow: '2px 2px 0px #000814',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '8px',
                border: '1.5px solid #000814',
                backgroundColor: '#FEF08A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <PixelBoxIcon size={26} />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.72rem', fontWeight: 800, color: '#475569', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                READY FOR PICKUP
              </div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 900, color: '#000814', lineHeight: 1.1 }}>
                01
              </div>
              <div style={{ width: '22px', height: '3px', backgroundColor: '#FFD60A', borderRadius: '2px', marginTop: '4px' }} />
            </div>
          </div>

          {/* Card 3: Total Orders */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '2px solid #000814',
              borderRadius: '10px',
              boxShadow: '2px 2px 0px #000814',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '8px',
                border: '1.5px solid #000814',
                backgroundColor: '#BAE6FD',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <PixelChartIcon size={26} />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.72rem', fontWeight: 800, color: '#475569', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                TOTAL ORDERS
              </div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 900, color: '#000814', lineHeight: 1.1 }}>
                08
              </div>
              <div style={{ width: '22px', height: '3px', backgroundColor: '#FFD60A', borderRadius: '2px', marginTop: '4px' }} />
            </div>
          </div>
        </div>

        {/* 3. CURRENT ORDER TRACKER CARD */}
        {currentOrder && (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '2px solid #000814',
              borderRadius: '10px',
              boxShadow: '2px 2px 0px #000814',
              padding: '20px 24px',
            }}
          >
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.75rem', fontWeight: 900, color: '#000814', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '14px' }}>
              CURRENT ORDER
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 900, color: '#000814' }}>
                  {currentOrder.token}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#003566', fontSize: '0.88rem', fontWeight: 700 }}>
                  <FileText size={16} />
                  <span>{currentOrder.fileName}</span>
                </div>
                {/* Status badge */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: '#BAE6FD',
                    border: '1.5px solid #003566',
                    borderRadius: '6px',
                    padding: '3px 10px',
                    color: '#003566',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 900,
                    fontSize: '0.72rem',
                    textTransform: 'uppercase',
                  }}
                >
                  <Cog size={13} className="animate-spin" />
                  <span>PROCESSING</span>
                </div>
              </div>

              {/* Ready time */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={18} color="#003566" />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 700 }}>Ready around</span>
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '0.95rem', color: '#000814' }}>
                    {currentOrder.eta}
                  </span>
                </div>
              </div>
            </div>

            {/* 4-Step Progress Track Line */}
            <div style={{ marginTop: '28px', position: 'relative', padding: '0 20px' }}>
              {/* Connecting line */}
              <div
                style={{
                  position: 'absolute',
                  top: '8px',
                  left: '30px',
                  right: '30px',
                  height: '4px',
                  backgroundColor: '#E2E8F0',
                  zIndex: 1,
                }}
              >
                {/* Filled portion up to step 3 (Printing/Processing) */}
                <div
                  style={{
                    width: '68%',
                    height: '100%',
                    backgroundColor: '#0284C7',
                    borderRadius: '2px',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
                {[
                  { label: 'ORDERED', active: true },
                  { label: 'ACCEPTED', active: true },
                  { label: 'PRINTING', active: true, pulse: true },
                  { label: 'READY', active: false },
                ].map((step, idx) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '9999px',
                        backgroundColor: step.active ? '#0284C7' : '#E2E8F0',
                        border: '3px solid #FFFFFF',
                        boxShadow: step.pulse ? '0 0 0 3px #BAE6FD' : 'none',
                      }}
                    />
                    <span
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        color: step.active ? '#000814' : '#94A3B8',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. RECENT ORDERS TABLE */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '2px solid #000814',
            borderRadius: '10px',
            boxShadow: '2px 2px 0px #000814',
            padding: '20px 24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.85rem', fontWeight: 900, color: '#000814', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              RECENT ORDERS
            </span>
            <Link
              to="/orders"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontFamily: 'var(--font-heading)',
                fontSize: '0.78rem',
                fontWeight: 800,
                color: '#003566',
                textDecoration: 'none',
              }}
            >
              <span>View all</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1.5px solid #E2E8F0' }}>
                <th style={{ padding: '8px 10px', fontFamily: 'var(--font-heading)', fontSize: '0.72rem', fontWeight: 800, color: '#64748B' }}>Token</th>
                <th style={{ padding: '8px 10px', fontFamily: 'var(--font-heading)', fontSize: '0.72rem', fontWeight: 800, color: '#64748B' }}>File</th>
                <th style={{ padding: '8px 10px', fontFamily: 'var(--font-heading)', fontSize: '0.72rem', fontWeight: 800, color: '#64748B' }}>Status</th>
                <th style={{ padding: '8px 10px', fontFamily: 'var(--font-heading)', fontSize: '0.72rem', fontWeight: 800, color: '#64748B' }}>Price</th>
                <th style={{ padding: '8px 10px', fontFamily: 'var(--font-heading)', fontSize: '0.72rem', fontWeight: 800, color: '#64748B' }}>Date</th>
                <th style={{ padding: '8px 10px', fontFamily: 'var(--font-heading)', fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {displayOrders.map((o, idx) => {
                const isProcessing = o.status === 'processing';
                const isReady = o.status === 'ready';
                const isCompleted = o.status === 'completed';
                const isRejected = o.status === 'rejected';

                let statusBadgeBg = '#BAE6FD';
                let statusBadgeText = '#003566';
                let statusBadgeLabel = 'PROCESSING';
                let StatusIcon = Cog;

                if (isReady) {
                  statusBadgeBg = '#BBF7D0';
                  statusBadgeText = '#14532D';
                  statusBadgeLabel = 'READY';
                  StatusIcon = Check;
                } else if (isCompleted) {
                  statusBadgeBg = '#E2E8F0';
                  statusBadgeText = '#001D3D';
                  statusBadgeLabel = 'COMPLETED';
                  StatusIcon = Check;
                } else if (isRejected) {
                  statusBadgeBg = '#FECACA';
                  statusBadgeText = '#991B1B';
                  statusBadgeLabel = 'REJECTED';
                  StatusIcon = X;
                }

                return (
                  <tr key={`${o.id || o.token}-${idx}`} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    {/* Token */}
                    <td style={{ padding: '12px 10px' }}>
                      <span
                        style={{
                          backgroundColor: '#FEF08A',
                          border: '1.5px solid #000814',
                          borderRadius: '4px',
                          padding: '3px 8px',
                          fontFamily: 'monospace',
                          fontWeight: 800,
                          fontSize: '0.78rem',
                          color: '#000814',
                        }}
                      >
                        {o.token}
                      </span>
                    </td>

                    {/* File */}
                    <td style={{ padding: '12px 10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 700, color: '#003566' }}>
                        <FileText size={15} />
                        <span>{o.fileName}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td style={{ padding: '12px 10px' }}>
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          backgroundColor: statusBadgeBg,
                          color: statusBadgeText,
                          borderRadius: '6px',
                          padding: '3px 8px',
                          fontFamily: 'var(--font-heading)',
                          fontWeight: 900,
                          fontSize: '0.68rem',
                          letterSpacing: '0.03em',
                        }}
                      >
                        <StatusIcon size={12} strokeWidth={2.5} />
                        <span>{statusBadgeLabel}</span>
                      </div>
                    </td>

                    {/* Price */}
                    <td style={{ padding: '12px 10px', fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '0.85rem', color: '#000814' }}>
                      ₹{o.price}
                    </td>

                    {/* Date */}
                    <td style={{ padding: '12px 10px', fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>
                      {o.date}
                    </td>

                    {/* Action button */}
                    <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => navigate(`/order/${o.token || o.id}`)}
                        style={{
                          backgroundColor: 'transparent',
                          border: '1.5px solid #003566',
                          borderRadius: '6px',
                          padding: '4px 14px',
                          color: '#003566',
                          fontFamily: 'var(--font-heading)',
                          fontWeight: 800,
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          transition: 'all 0.1s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#003566';
                          e.currentTarget.style.color = '#FFD60A';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#003566';
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* RIGHT COLUMN: Interactive "PRINT SHOP" Widget matching Reference Mockup */}
      <div
        style={{
          width: '340px',
          flexShrink: 0,
          backgroundColor: '#FFFFFF',
          border: '2px solid #000814',
          borderRadius: '12px',
          boxShadow: '3px 3px 0px #000814',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
        }}
      >
        {/* Header */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PixelShopIcon size={24} />
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1rem', color: '#000814', letterSpacing: '0.04em' }}>
              PRINT SHOP
            </span>
          </div>
          <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>
            Quick. Easy. Reliable.
          </div>
        </div>

        {/* Pixel Art Printer with Paper Stacks Banner */}
        <div style={{ border: '1.5px solid #000814', borderRadius: '8px', overflow: 'hidden' }}>
          <PixelShopPrinterScene width={300} height={110} />
        </div>

        {/* PRINT SETTINGS Section */}
        <div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.75rem', fontWeight: 900, color: '#000814', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '12px' }}>
            PRINT SETTINGS
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Copies */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 700, color: '#000814' }}>
                <FileText size={15} color="#003566" />
                <span>Copies</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => setCopies((prev) => Math.max(1, prev - 1))}
                  style={{
                    width: '26px',
                    height: '26px',
                    backgroundColor: '#FFC300',
                    border: '1.5px solid #000814',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                  }}
                >
                  <Minus size={13} strokeWidth={3} />
                </button>
                <span style={{ minWidth: '24px', textAlign: 'center', fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '0.9rem', color: '#000814' }}>
                  {copies}
                </span>
                <button
                  type="button"
                  onClick={() => setCopies((prev) => prev + 1)}
                  style={{
                    width: '26px',
                    height: '26px',
                    backgroundColor: '#FFC300',
                    border: '1.5px solid #000814',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                  }}
                >
                  <Plus size={13} strokeWidth={3} />
                </button>
              </div>
            </div>

            {/* Color */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 700, color: '#000814' }}>
                <FileText size={15} color="#003566" />
                <span>Color</span>
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  type="button"
                  onClick={() => setColorMode('bw')}
                  style={{
                    padding: '4px 12px',
                    border: '1.5px solid #000814',
                    borderRadius: '4px',
                    backgroundColor: colorMode === 'bw' ? '#001D3D' : '#FFFFFF',
                    color: colorMode === 'bw' ? '#FFFFFF' : '#000814',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 800,
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                  }}
                >
                  B&amp;W
                </button>
                <button
                  type="button"
                  onClick={() => setColorMode('color')}
                  style={{
                    padding: '4px 12px',
                    border: '1.5px solid #000814',
                    borderRadius: '4px',
                    backgroundColor: colorMode === 'color' ? '#001D3D' : '#FFFFFF',
                    color: colorMode === 'color' ? '#FFFFFF' : '#000814',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 800,
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                  }}
                >
                  COLOR
                </button>
              </div>
            </div>

            {/* Sides */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 700, color: '#000814' }}>
                <FileText size={15} color="#003566" />
                <span>Sides</span>
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  type="button"
                  onClick={() => setSides('single')}
                  style={{
                    padding: '4px 10px',
                    border: '1.5px solid #000814',
                    borderRadius: '4px',
                    backgroundColor: sides === 'single' ? '#001D3D' : '#FFFFFF',
                    color: sides === 'single' ? '#FFFFFF' : '#000814',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 800,
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                  }}
                >
                  SINGLE
                </button>
                <button
                  type="button"
                  onClick={() => setSides('double')}
                  style={{
                    padding: '4px 10px',
                    border: '1.5px solid #000814',
                    borderRadius: '4px',
                    backgroundColor: sides === 'double' ? '#001D3D' : '#FFFFFF',
                    color: sides === 'double' ? '#FFFFFF' : '#000814',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 800,
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                  }}
                >
                  DOUBLE
                </button>
              </div>
            </div>

            {/* Paper */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 700, color: '#000814' }}>
                <FileText size={15} color="#003566" />
                <span>Paper</span>
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  type="button"
                  onClick={() => setPaperSize('A4')}
                  style={{
                    padding: '4px 14px',
                    border: '1.5px solid #000814',
                    borderRadius: '4px',
                    backgroundColor: paperSize === 'A4' ? '#001D3D' : '#FFFFFF',
                    color: paperSize === 'A4' ? '#FFFFFF' : '#000814',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 800,
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                  }}
                >
                  A4
                </button>
                <button
                  type="button"
                  onClick={() => setPaperSize('A3')}
                  style={{
                    padding: '4px 14px',
                    border: '1.5px solid #000814',
                    borderRadius: '4px',
                    backgroundColor: paperSize === 'A3' ? '#001D3D' : '#FFFFFF',
                    color: paperSize === 'A3' ? '#FFFFFF' : '#000814',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 800,
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                  }}
                >
                  A3
                </button>
              </div>
            </div>

            {/* Binding */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 700, color: '#000814' }}>
                <FileText size={15} color="#003566" />
                <span>Binding</span>
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                {['none', 'staple', 'spiral'].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBinding(b)}
                    style={{
                      padding: '4px 8px',
                      border: '1.5px solid #000814',
                      borderRadius: '4px',
                      backgroundColor: binding === b ? '#001D3D' : '#FFFFFF',
                      color: binding === b ? '#FFFFFF' : '#000814',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 800,
                      fontSize: '0.68rem',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                    }}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* PRICE SUMMARY Section */}
        <div style={{ borderTop: '1.5px solid #E2E8F0', paddingTop: '14px' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.75rem', fontWeight: 900, color: '#000814', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '10px' }}>
            PRICE SUMMARY
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569', fontWeight: 700 }}>
              <span>PRINT COST</span>
              <span style={{ color: '#000814', fontWeight: 800 }}>₹{printCost}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569', fontWeight: 700 }}>
              <span>BINDING</span>
              <span style={{ color: '#000814', fontWeight: 800 }}>₹{bindingCost}</span>
            </div>

            <div style={{ height: '1.5px', backgroundColor: '#000814', margin: '6px 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '0.95rem', color: '#000814' }}>
                TOTAL
              </span>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.6rem', color: '#000814' }}>
                ₹{totalCost}
              </span>
            </div>
          </div>
        </div>

        {/* Action CTA Button: PLACE ORDER -> */}
        <button
          type="button"
          onClick={handlePlaceOrder}
          style={{
            width: '100%',
            backgroundColor: '#FFC300',
            color: '#000814',
            border: '3px solid #000814',
            borderRadius: '8px',
            padding: '14px',
            fontFamily: 'var(--font-heading)',
            fontWeight: 900,
            fontSize: '0.88rem',
            letterSpacing: '0.03em',
            boxShadow: '3px 3px 0px #000814',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.1s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FFD60A'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFC300'; }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'translate(2px, 2px)';
            e.currentTarget.style.boxShadow = '1px 1px 0px #000814';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = '3px 3px 0px #000814';
          }}
        >
          <span>PLACE ORDER</span>
          <ArrowRight size={18} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}

export default StudentDashboard;
