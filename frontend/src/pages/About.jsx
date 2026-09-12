import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Printer,
  Sparkles,
  Zap,
  ShieldCheck,
  Clock,
  FileText,
  Layers,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Cpu,
  Server,
  Database,
  Cloud,
  Terminal,
} from 'lucide-react';
import { PrinterDemo } from '../components/PrinterDemo.jsx';
import { LoginCard } from '../components/LoginCard.jsx';

export function About() {
  const [demoStatus, setDemoStatus] = useState('processing');

  function scrollToLogin() {
    document.getElementById('about-login-section')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', paddingBottom: '60px' }}>
      {/* Hero Section */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '18px',
          padding: '40px 20px 20px',
        }}
      >
        {/* Team Shawarma Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--yellow-primary)',
            border: '2.5px solid #000',
            borderRadius: '20px',
            padding: '6px 16px',
            boxShadow: '3px 3px 0px #000',
            fontFamily: 'var(--font-heading)',
            fontWeight: 900,
            fontSize: '0.88rem',
            textTransform: 'uppercase',
          }}
        >
          <span>🌯 CREATED BY TEAM SHAWARMA</span>
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            textTransform: 'uppercase',
            maxWidth: '850px',
          }}
        >
          PRINT WITHOUT THE QUEUE.
        </h1>

        <p
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: 'var(--text-muted)',
            maxWidth: '680px',
            lineHeight: 1.6,
          }}
        >
          CampusPrint is an intelligent cloud print-dispatch system engineered specifically for colleges
          and universities. Upload from your dorm, customize your options, and pick up your documents
          in seconds with a verified digital token.
        </p>

        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '10px' }}>
          <button type="button" className="neo-btn primary" onClick={scrollToLogin}>
            <span>LOG IN / TRY DEMO</span>
            <ArrowRight size={18} strokeWidth={2.5} />
          </button>
          <a href="#how-it-works" className="neo-btn" style={{ textDecoration: 'none' }}>
            <span>EXPLORE FEATURES</span>
          </a>
        </div>
      </div>

      {/* The Problem vs The CampusPrint Solution */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
        }}
      >
        {/* Old Way */}
        <div
          className="neo-card"
          style={{
            background: '#FFF1F2',
            borderColor: '#E11D48',
            boxShadow: '4px 4px 0px #BE123C',
            padding: '28px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <XCircle size={24} color="#E11D48" />
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.3rem', color: '#9F1239' }}>
              THE OLD CAMPUS WAY
            </h2>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.92rem' }}>
              <span style={{ color: '#E11D48', fontWeight: 900 }}>✕</span>
              <span><strong>Endless Physical Queues:</strong> 40+ minutes lost before morning assignment deadlines.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.92rem' }}>
              <span style={{ color: '#E11D48', fontWeight: 900 }}>✕</span>
              <span><strong>USB Drive Risks:</strong> Malware transmission on public lab shop computers.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.92rem' }}>
              <span style={{ color: '#E11D48', fontWeight: 900 }}>✕</span>
              <span><strong>Pricing Confusion:</strong> Verbal miscommunication over single vs double-sided rates.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.92rem' }}>
              <span style={{ color: '#E11D48', fontWeight: 900 }}>✕</span>
              <span><strong>Zero Visibility:</strong> Students hovering around shop counter asking "Is mine done?"</span>
            </li>
          </ul>
        </div>

        {/* CampusPrint Way */}
        <div
          className="neo-card"
          style={{
            background: '#F0FDF4',
            borderColor: '#16A34A',
            boxShadow: '4px 4px 0px #15803D',
            padding: '28px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <CheckCircle2 size={24} color="#16A34A" />
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.3rem', color: '#166534' }}>
              THE CAMPUSPRINT WAY
            </h2>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.92rem' }}>
              <span style={{ color: '#16A34A', fontWeight: 900 }}>✓</span>
              <span><strong>Zero-Queue Remote Dispatch:</strong> Upload PDFs from your smartphone, laptop, or tablet anywhere on campus.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.92rem' }}>
              <span style={{ color: '#16A34A', fontWeight: 900 }}>✓</span>
              <span><strong>Instant Page & Cost Intelligence:</strong> Accurate client-side PDF page calculation with instant itemized bill.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.92rem' }}>
              <span style={{ color: '#16A34A', fontWeight: 900 }}>✓</span>
              <span><strong>Unique Digital Pickup Tokens:</strong> Distinct tokens like <code>CP-101</code> for seamless contactless counter pickup.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.92rem' }}>
              <span style={{ color: '#16A34A', fontWeight: 900 }}>✓</span>
              <span><strong>Real-Time Live Queue & Simulation:</strong> Live status synchronization with interactive 3D printer hardware simulation.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works">
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 900 }}>
            HOW IT WORKS
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Four effortless steps from document to printed paper
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
          {[
            {
              step: '01',
              title: 'Upload Document',
              desc: 'Select or drag-and-drop any PDF file up to 25MB. Instant client-side page count verification.',
              color: '#FEF08A',
            },
            {
              step: '02',
              title: 'Select Preferences',
              desc: 'Pick Black & White or Full Color, single/double sided, and optional binding (Stapled or Spiral).',
              color: '#BFDBFE',
            },
            {
              step: '03',
              title: 'Track Live Progress',
              desc: 'Get your unique token (e.g. CP-101). Watch real-time printer status updates and queue countdown.',
              color: '#93C5FD',
            },
            {
              step: '04',
              title: 'Fast Counter Pickup',
              desc: 'Show your token at the print desk when your order transitions to READY. Grab your prints and go!',
              color: '#86EFAC',
            },
          ].map((item) => (
            <div
              key={item.step}
              className="neo-card"
              style={{
                background: item.color,
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '2.6rem',
                  fontWeight: 900,
                  lineHeight: 1,
                  opacity: 0.35,
                }}
              >
                {item.step}
              </div>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.15rem' }}>
                {item.title}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#1E293B', lineHeight: 1.45 }}>
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive 3D Hardware Simulation Showcase */}
      <div
        className="neo-card"
        style={{
          background: '#fff',
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#DBEAFE',
                border: '1.5px solid #000',
                borderRadius: '4px',
                padding: '2px 8px',
                fontSize: '0.75rem',
                fontWeight: 800,
                fontFamily: 'var(--font-heading)',
                marginBottom: '6px',
              }}
            >
              <Cpu size={14} />
              <span>LIVE HARDWARE SIMULATION ENGINE</span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 900 }}>
              Real-Time 3D Printer Simulation
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              CampusPrint includes an embedded HTML5 Canvas 3D hardware simulator showing print head traversal, paper feed, and dual-sided PDF page texturing.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['placed', 'accepted', 'processing', 'ready'].map((st) => (
              <button
                key={st}
                type="button"
                className={`neo-btn sm ${demoStatus === st ? 'primary' : ''}`}
                onClick={() => setDemoStatus(st)}
                style={{ textTransform: 'capitalize' }}
              >
                Simulate: {st}
              </button>
            ))}
          </div>
        </div>

        <PrinterDemo
          orderId="CP-DEMO"
          status={demoStatus}
          pages={8}
          copies={1}
          options={{ colorMode: 'color', sided: 'double', paperSize: 'A4', binding: 'none' }}
        />
      </div>

      {/* Team Shawarma Spotlight */}
      <div
        className="neo-card"
        style={{
          background: '#FEF08A',
          border: '3px solid #000',
          boxShadow: '5px 5px 0px #000',
          padding: '36px 28px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            fontSize: '8rem',
            opacity: 0.12,
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        >
          🌯
        </div>

        <div style={{ maxWidth: '800px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#000',
              color: '#fff',
              padding: '4px 12px',
              borderRadius: '4px',
              fontSize: '0.8rem',
              fontWeight: 800,
              fontFamily: 'var(--font-heading)',
              marginBottom: '14px',
            }}
          >
            <span>ENGINEERED WITH PASSION</span>
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 4vw, 2.8rem)',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              marginBottom: '14px',
            }}
          >
            CREATED BY TEAM SHAWARMA
          </h2>

          <p style={{ fontSize: '1.05rem', lineHeight: 1.6, color: '#1F2937', marginBottom: '24px' }}>
            Team Shawarma conceptualized and constructed CampusPrint to eliminate everyday campus friction.
            We combined modern Neo-Brutalist design aesthetics with resilient cloud architecture to ensure that
            no student ever misses an assignment or exam submission because of a broken print queue.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '12px',
              background: '#fff',
              border: '2px solid #000',
              borderRadius: '8px',
              padding: '16px',
            }}
          >
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)' }}>FRONTEND</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '0.95rem' }}>React 18 + Vite</div>
              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Neo-Brutalist Design System</div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)' }}>BACKEND ENGINE</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '0.95rem' }}>Node.js + Express</div>
              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>JWT Auth & Multer Pipeline</div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)' }}>AWS CLOUD</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '0.95rem' }}>ECS Fargate + ALB</div>
              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>API Gateway & HTTPS</div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)' }}>DATABASE</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '0.95rem' }}>Amazon DynamoDB</div>
              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Real-Time State Sync</div>
            </div>
          </div>
        </div>
      </div>

      {/* End of Page: Login Pop-up / Section */}
      <div
        id="about-login-section"
        style={{
          borderTop: '3px dashed #000',
          paddingTop: '40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#86EFAC',
              border: '2px solid #000',
              borderRadius: '20px',
              padding: '4px 14px',
              fontSize: '0.8rem',
              fontWeight: 800,
              fontFamily: 'var(--font-heading)',
              marginBottom: '10px',
            }}
          >
            <Sparkles size={14} />
            <span>READY TO TEST THE PLATFORM?</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 900 }}>
            Log In or Quick Jump As a Judge
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', maxWidth: '500px', margin: '0 auto' }}>
            Click any role button below to instantly experience the student or staff workflow!
          </p>
        </div>

        {/* Embedded Complete Login Card */}
        <LoginCard
          title="CampusPrint Portal"
          subtitle="One-click demo logins active for immediate evaluation"
        />
      </div>
    </div>
  );
}
