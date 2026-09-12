import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
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
  ExternalLink,
} from 'lucide-react';
import { PrinterDemo } from '../components/PrinterDemo.jsx';
import { NeoCard, NeoButton } from '../components/ui/index.js';
import { PixelCampusBuilding, PixelHeroPrinter } from '../components/pixel/index.js';
import { PixelLogo, PixelSparkles, PixelTicketGraphic, PixelUploadDoc } from '../components/PixelArt.jsx';

export function About() {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [demoStatus, setDemoStatus] = useState('processing');
  const [busy, setBusy] = useState(false);
  const [authError, setAuthError] = useState('');

  function scrollToLogin() {
    document.getElementById('about-judge-section')?.scrollIntoView({ behavior: 'smooth' });
  }

  async function handleQuickLogin(targetEmail, targetPassword) {
    setBusy(true);
    setAuthError('');
    try {
      const loggedUser = await login(targetEmail, targetPassword);
      navigate(loggedUser.role === 'staff' ? '/staff' : '/dashboard');
    } catch (err) {
      setAuthError(err.message || 'Quick login failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '44px', paddingBottom: '60px' }}>
      {/* 1. HERO BANNER: GOLDEN TWILIGHT NEO-BRUTALIST */}
      <div
        style={{
          backgroundColor: '#001D3D',
          borderRadius: '16px',
          border: '3px solid #000814',
          boxShadow: '6px 6px 0px 0px #000814',
          padding: 'clamp(32px, 5vw, 56px) 28px',
          color: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '20px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle background glow */}
        <div
          style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(255,195,0,0.2) 0%, rgba(0,29,61,0) 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Team Shawarma Pill Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#FFC300',
            color: '#000814',
            border: '2px solid #000814',
            borderRadius: '9999px',
            padding: '6px 18px',
            boxShadow: '3px 3px 0px 0px #000814',
            fontFamily: 'var(--font-heading)',
            fontWeight: 900,
            fontSize: '0.88rem',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          <span>🌯 CREATED BY TEAM SHAWARMA</span>
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.4rem, 5.5vw, 4rem)',
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            textTransform: 'uppercase',
            maxWidth: '900px',
            margin: 0,
            color: '#FFFFFF',
          }}
        >
          PRINT WITHOUT <span style={{ color: '#FFD60A' }}>THE QUEUE.</span>
        </h1>

        <p
          style={{
            fontSize: 'clamp(1rem, 1.8vw, 1.2rem)',
            color: '#94A3B8',
            maxWidth: '720px',
            lineHeight: 1.6,
            fontWeight: 600,
            margin: 0,
          }}
        >
          CampusPrint is an intelligent cloud print-dispatch system engineered specifically for colleges
          and universities. Upload from your dorm, customize your options, and pick up your documents
          in seconds with a verified digital token.
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '8px' }}>
          <NeoButton
            variant="primary"
            size="lg"
            onClick={scrollToLogin}
            style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            <span>TRY DEMO / JUDGES ACCESS</span>
            <ArrowRight size={18} strokeWidth={3} />
          </NeoButton>

          <a
            href="#how-it-works"
            style={{
              padding: '12px 20px',
              borderRadius: '12px',
              border: '2px solid #000814',
              backgroundColor: '#FFFFFF',
              color: '#000814',
              boxShadow: '3px 3px 0px 0px #000814',
              fontFamily: 'var(--font-heading)',
              fontWeight: 900,
              fontSize: '0.95rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>EXPLORE FEATURES</span>
          </a>
        </div>
      </div>

      {/* 2. THE PROBLEM VS THE CAMPUSPRINT SOLUTION */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
        }}
      >
        {/* Old Campus Way */}
        <NeoCard
          variant="default"
          style={{
            backgroundColor: '#FFF1F2',
            borderColor: '#000814',
            borderWidth: '2.5px',
            boxShadow: '4px 4px 0px 0px #000814',
            padding: '28px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                backgroundColor: '#FECACA',
                border: '2px solid #000814',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '2px 2px 0px #000814',
              }}
            >
              <XCircle size={22} color="#DC2626" />
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.35rem', color: '#991B1B', margin: 0 }}>
              THE OLD CAMPUS WAY
            </h2>
          </div>

          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.92rem', color: '#1F2937' }}>
              <span style={{ color: '#DC2626', fontWeight: 900, fontSize: '1.1rem', lineHeight: 1 }}>✕</span>
              <span><strong>Endless Physical Queues:</strong> 40+ minutes lost before morning assignment deadlines.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.92rem', color: '#1F2937' }}>
              <span style={{ color: '#DC2626', fontWeight: 900, fontSize: '1.1rem', lineHeight: 1 }}>✕</span>
              <span><strong>USB Drive Risks:</strong> Malware transmission on public lab shop computers.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.92rem', color: '#1F2937' }}>
              <span style={{ color: '#DC2626', fontWeight: 900, fontSize: '1.1rem', lineHeight: 1 }}>✕</span>
              <span><strong>Pricing Confusion:</strong> Verbal miscommunication over single vs double-sided rates.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.92rem', color: '#1F2937' }}>
              <span style={{ color: '#DC2626', fontWeight: 900, fontSize: '1.1rem', lineHeight: 1 }}>✕</span>
              <span><strong>Zero Visibility:</strong> Students hovering around shop counter asking "Is mine done?"</span>
            </li>
          </ul>
        </NeoCard>

        {/* CampusPrint Way */}
        <NeoCard
          variant="default"
          style={{
            backgroundColor: '#F0FDF4',
            borderColor: '#000814',
            borderWidth: '2.5px',
            boxShadow: '4px 4px 0px 0px #000814',
            padding: '28px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                backgroundColor: '#BBF7D0',
                border: '2px solid #000814',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '2px 2px 0px #000814',
              }}
            >
              <CheckCircle2 size={22} color="#166534" />
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.35rem', color: '#166534', margin: 0 }}>
              THE CAMPUSPRINT WAY
            </h2>
          </div>

          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.92rem', color: '#1F2937' }}>
              <span style={{ color: '#16A34A', fontWeight: 900, fontSize: '1.1rem', lineHeight: 1 }}>✓</span>
              <span><strong>Zero-Queue Remote Dispatch:</strong> Upload PDFs from your smartphone, laptop, or tablet anywhere on campus.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.92rem', color: '#1F2937' }}>
              <span style={{ color: '#16A34A', fontWeight: 900, fontSize: '1.1rem', lineHeight: 1 }}>✓</span>
              <span><strong>Instant Page &amp; Cost Intelligence:</strong> Accurate client-side PDF page calculation with instant itemized bill.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.92rem', color: '#1F2937' }}>
              <span style={{ color: '#16A34A', fontWeight: 900, fontSize: '1.1rem', lineHeight: 1 }}>✓</span>
              <span><strong>Unique Digital Pickup Tokens:</strong> Distinct tokens like <code>CP-101</code> for seamless contactless counter pickup.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.92rem', color: '#1F2937' }}>
              <span style={{ color: '#16A34A', fontWeight: 900, fontSize: '1.1rem', lineHeight: 1 }}>✓</span>
              <span><strong>Real-Time Live Queue &amp; Simulation:</strong> Live status synchronization with interactive 3D printer hardware simulation.</span>
            </li>
          </ul>
        </NeoCard>
      </div>

      {/* 3. HOW IT WORKS (4 STEPS) */}
      <div id="how-it-works">
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#003566',
              color: '#FFD60A',
              border: '1.5px solid #000814',
              borderRadius: '9999px',
              padding: '4px 14px',
              fontSize: '0.78rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              textTransform: 'uppercase',
              marginBottom: '8px',
            }}
          >
            <Clock size={13} />
            <span>STREAMLINED WORKFLOW</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', fontWeight: 900, margin: 0, color: '#000814' }}>
            HOW IT WORKS
          </h2>
          <p style={{ color: '#4B5563', fontSize: '0.95rem', fontWeight: 600, marginTop: '4px' }}>
            Four effortless steps from document to printed paper
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
          {[
            {
              step: '01',
              title: 'Upload Document',
              desc: 'Select or drag-and-drop any PDF file up to 25MB. Instant client-side page count verification.',
              variant: 'yellow',
            },
            {
              step: '02',
              title: 'Select Preferences',
              desc: 'Pick Black & White or Full Color, single/double sided, and optional binding (Stapled or Spiral).',
              variant: 'sky',
            },
            {
              step: '03',
              title: 'Track Live Progress',
              desc: 'Get your unique token (e.g. CP-101). Watch real-time printer status updates and queue countdown.',
              variant: 'lavender',
            },
            {
              step: '04',
              title: 'Fast Counter Pickup',
              desc: 'Show your token at the print desk when your order transitions to READY. Grab your prints and go!',
              variant: 'mint',
            },
          ].map((item) => (
            <NeoCard
              key={item.step}
              variant={item.variant}
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '2.8rem',
                  fontWeight: 900,
                  lineHeight: 1,
                  opacity: 0.35,
                  color: '#000814',
                }}
              >
                {item.step}
              </div>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.2rem', color: '#000814' }}>
                {item.title}
              </div>
              <div style={{ fontSize: '0.88rem', color: '#1F2937', lineHeight: 1.5, fontWeight: 600 }}>
                {item.desc}
              </div>
            </NeoCard>
          ))}
        </div>
      </div>

      {/* 4. INTERACTIVE 3D HARDWARE SIMULATION SHOWCASE */}
      <NeoCard
        variant="default"
        style={{
          backgroundColor: '#FFFFFF',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#003566',
                color: '#FFD60A',
                border: '1.5px solid #000814',
                borderRadius: '6px',
                padding: '3px 10px',
                fontSize: '0.75rem',
                fontWeight: 800,
                fontFamily: 'var(--font-heading)',
                marginBottom: '8px',
              }}
            >
              <Cpu size={14} />
              <span>LIVE HARDWARE SIMULATION ENGINE</span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 900, margin: 0, color: '#000814' }}>
              Real-Time 3D Printer Simulation
            </h2>
            <p style={{ color: '#4B5563', fontSize: '0.9rem', fontWeight: 600, marginTop: '4px', maxWidth: '640px' }}>
              CampusPrint includes an embedded HTML5 Canvas 3D hardware simulator rendering print head traversal, paper feeding animations, and dual-sided document textures.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['placed', 'accepted', 'processing', 'ready'].map((st) => (
              <NeoButton
                key={st}
                variant={demoStatus === st ? 'primary' : 'default'}
                size="sm"
                onClick={() => setDemoStatus(st)}
                style={{ textTransform: 'uppercase', fontSize: '0.78rem' }}
              >
                {st}
              </NeoButton>
            ))}
          </div>
        </div>

        <div style={{ borderRadius: '12px', overflow: 'hidden', border: '2px solid #000814' }}>
          <PrinterDemo
            order={{
              orderId: 'CP-DEMO',
              fileName: 'campus_assignment.pdf',
              pages: 8,
              copies: 1,
              options: { colorMode: 'color', sided: 'double', paperSize: 'A4', binding: 'none' },
            }}
            orderStatus={demoStatus}
            height="380px"
            title="Interactive 3D Hardware Simulation Station"
          />
        </div>
      </NeoCard>

      {/* 5. TEAM SHAWARMA SPOTLIGHT */}
      <NeoCard
        variant="default"
        style={{
          backgroundColor: '#001D3D',
          border: '3px solid #000814',
          boxShadow: '6px 6px 0px 0px #000814',
          padding: '36px 32px',
          position: 'relative',
          overflow: 'hidden',
          color: '#FFFFFF',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-25px',
            right: '-15px',
            fontSize: '9rem',
            opacity: 0.12,
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        >
          🌯
        </div>

        <div style={{ maxWidth: '820px', position: 'relative', zIndex: 2 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#FFC300',
              color: '#000814',
              padding: '4px 14px',
              borderRadius: '6px',
              border: '1.5px solid #000814',
              fontSize: '0.8rem',
              fontWeight: 900,
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
              color: '#FFD60A',
            }}
          >
            CREATED BY TEAM SHAWARMA
          </h2>

          <p style={{ fontSize: '1.05rem', lineHeight: 1.6, color: '#E2E8F0', marginBottom: '24px', fontWeight: 600 }}>
            Team Shawarma conceptualized and constructed CampusPrint to eliminate everyday campus friction.
            We combined modern Neo-Brutalist design aesthetics with resilient cloud architecture to ensure that
            no student ever misses an assignment or exam submission because of a broken print queue.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '12px',
              backgroundColor: '#000814',
              border: '2px solid #000814',
              borderRadius: '12px',
              padding: '18px',
              boxShadow: '3px 3px 0px 0px rgba(0,0,0,0.5)',
            }}
          >
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 900, color: '#FFC300', fontFamily: 'var(--font-heading)' }}>FRONTEND</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '0.98rem', color: '#FFFFFF', marginTop: '2px' }}>React 18 + Vite</div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Golden Twilight Pixel UI</div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 900, color: '#FFC300', fontFamily: 'var(--font-heading)' }}>BACKEND ENGINE</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '0.98rem', color: '#FFFFFF', marginTop: '2px' }}>Node.js + Express</div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>JWT Auth &amp; Resend Mailer</div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 900, color: '#FFC300', fontFamily: 'var(--font-heading)' }}>AWS CLOUD</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '0.98rem', color: '#FFFFFF', marginTop: '2px' }}>ECS Fargate + ALB</div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>API Gateway &amp; HTTPS</div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 900, color: '#FFC300', fontFamily: 'var(--font-heading)' }}>DATABASE</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '0.98rem', color: '#FFFFFF', marginTop: '2px' }}>Amazon DynamoDB</div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Real-Time State Sync</div>
            </div>
          </div>
        </div>
      </NeoCard>

      {/* 6. ONE-CLICK JUDGE EVALUATION ACCESS / LOGIN JUMP */}
      <div
        id="about-judge-section"
        style={{
          borderTop: '3px dashed #000814',
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
              backgroundColor: '#FFC300',
              color: '#000814',
              border: '2px solid #000814',
              borderRadius: '9999px',
              padding: '4px 16px',
              fontSize: '0.8rem',
              fontWeight: 900,
              fontFamily: 'var(--font-heading)',
              marginBottom: '10px',
              boxShadow: '2px 2px 0px #000814',
            }}
          >
            <Sparkles size={14} />
            <span>ONE-CLICK DEMO ACCESS FOR JUDGES &amp; EVALUATORS</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', fontWeight: 900, margin: 0, color: '#000814' }}>
            Instant Role Jump
          </h2>
          <p style={{ color: '#4B5563', fontSize: '0.95rem', fontWeight: 600, maxWidth: '540px', margin: '6px auto 0' }}>
            Select any role below to immediately log in and explore the full live workflow!
          </p>
        </div>

        {authError && (
          <div
            style={{
              backgroundColor: '#FECACA',
              border: '2px solid #DC2626',
              borderRadius: '10px',
              padding: '12px 18px',
              color: '#991B1B',
              fontWeight: 800,
              fontSize: '0.9rem',
              boxShadow: '3px 3px 0px #DC2626',
            }}
          >
            {authError}
          </div>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
            gap: '16px',
            width: '100%',
            maxWidth: '920px',
          }}
        >
          <NeoCard
            variant="yellow"
            style={{
              cursor: busy ? 'not-allowed' : 'pointer',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              transition: 'transform 0.1s ease',
            }}
            onClick={() => !busy && handleQuickLogin('staff@campusprint.demo', 'staff123')}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.4rem' }}>🖨️</span>
              <span style={{ fontSize: '0.72rem', backgroundColor: '#000814', color: '#FFFFFF', padding: '2px 8px', borderRadius: '4px', fontWeight: 800 }}>
                OPERATOR
              </span>
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.1rem', color: '#000814' }}>
              Staff Operator
            </div>
            <div style={{ fontSize: '0.8rem', color: '#451A03', fontWeight: 600 }}>
              Live dispatch queue, 3D hardware simulator, order fulfillment &amp; email alerts
            </div>
            <div style={{ marginTop: 'auto', paddingTop: '8px', fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '0.85rem', color: '#000814' }}>
              Jump to Staff &rarr;
            </div>
          </NeoCard>

          <NeoCard
            variant="sky"
            style={{
              cursor: busy ? 'not-allowed' : 'pointer',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              transition: 'transform 0.1s ease',
            }}
            onClick={() => !busy && handleQuickLogin('student@campusprint.demo', 'student123')}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.4rem' }}>🎓</span>
              <span style={{ fontSize: '0.72rem', backgroundColor: '#000814', color: '#FFFFFF', padding: '2px 8px', borderRadius: '4px', fontWeight: 800 }}>
                STUDENT
              </span>
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.1rem', color: '#000814' }}>
              Judge Student
            </div>
            <div style={{ fontSize: '0.8rem', color: '#0C4A6E', fontWeight: 600 }}>
              Student dashboard, live ticket ETA chip, order history &amp; PDF upload flow
            </div>
            <div style={{ marginTop: 'auto', paddingTop: '8px', fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '0.85rem', color: '#000814' }}>
              Jump to Student &rarr;
            </div>
          </NeoCard>

          <NeoCard
            variant="mint"
            style={{
              cursor: busy ? 'not-allowed' : 'pointer',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              transition: 'transform 0.1s ease',
            }}
            onClick={() => !busy && handleQuickLogin('ananya@campusprint.demo', 'demo123')}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.4rem' }}>📄</span>
              <span style={{ fontSize: '0.72rem', backgroundColor: '#000814', color: '#FFFFFF', padding: '2px 8px', borderRadius: '4px', fontWeight: 800 }}>
                READY ORDER
              </span>
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.1rem', color: '#000814' }}>
              Ananya Iyer
            </div>
            <div style={{ fontSize: '0.8rem', color: '#064E3B', fontWeight: 600 }}>
              Pre-seeded order in READY status with pickup token receipt verification
            </div>
            <div style={{ marginTop: 'auto', paddingTop: '8px', fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '0.85rem', color: '#000814' }}>
              Jump to Orders &rarr;
            </div>
          </NeoCard>

          <NeoCard
            variant="lavender"
            style={{
              cursor: busy ? 'not-allowed' : 'pointer',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              transition: 'transform 0.1s ease',
            }}
            onClick={() => !busy && handleQuickLogin('karthik@campusprint.demo', 'demo123')}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.4rem' }}>📘</span>
              <span style={{ fontSize: '0.72rem', backgroundColor: '#000814', color: '#FFFFFF', padding: '2px 8px', borderRadius: '4px', fontWeight: 800 }}>
                PROCESSING
              </span>
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.1rem', color: '#000814' }}>
              Karthik Rao
            </div>
            <div style={{ fontSize: '0.8rem', color: '#312E81', fontWeight: 600 }}>
              Active capstone print job in progress with live printer head animation
            </div>
            <div style={{ marginTop: 'auto', paddingTop: '8px', fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '0.85rem', color: '#000814' }}>
              Jump to Tracking &rarr;
            </div>
          </NeoCard>
        </div>

        <div style={{ marginTop: '12px', textAlign: 'center' }}>
          <Link
            to="/login"
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 900,
              fontSize: '0.95rem',
              color: '#000814',
              textDecoration: 'underline',
            }}
          >
            Or go to Standard Login / Sign Up Page &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}

export default About;
