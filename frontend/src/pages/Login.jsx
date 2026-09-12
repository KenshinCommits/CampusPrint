import { Link } from 'react-router-dom';
import { Printer, Upload, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { LoginCard } from '../components/LoginCard.jsx';

export function Login() {
  return (
    <div className="auth-split-grid">
      {/* Left Column: Hero Showcase */}
      <div className="auth-hero">
        <h1 className="auth-hero-title">
          PRINT WITHOUT<br />THE QUEUE.
        </h1>
        <p className="auth-hero-desc">
          Upload your document. Choose your print options. Pay. Pick it up when it's ready.
        </p>

        <div>
          <Link
            to="/about"
            className="neo-btn primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
          >
            <span>GET STARTED</span>
            <ArrowRight size={18} strokeWidth={2.5} />
          </Link>
        </div>

        {/* Neo-brutalist Printer Illustration */}
        <div
          style={{
            position: 'relative',
            background: '#FCE77D',
            border: '3px solid #000',
            borderRadius: '12px',
            padding: '28px',
            boxShadow: '4px 4px 0px #000',
            maxWidth: '460px',
            margin: '10px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                background: '#3B82F6',
                border: '2.5px solid #000',
                borderRadius: '8px',
                boxShadow: '2px 2px 0px #000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
              }}
            >
              <Printer size={36} strokeWidth={2.2} />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.1rem' }}>
                PRINT DISPATCH READY
              </div>
              <div style={{ fontSize: '0.85rem', color: '#333' }}>
                Tokens instantly synced to shop floor
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div
              style={{
                background: '#fff',
                border: '2px solid #000',
                borderRadius: '4px',
                padding: '3px 8px',
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                fontSize: '0.75rem',
                boxShadow: '1.5px 1.5px 0px #000',
                transform: 'rotate(-3deg)',
              }}
            >
              CP-1041 📄
            </div>
            <div
              style={{
                background: '#86EFAC',
                border: '2px solid #000',
                borderRadius: '4px',
                padding: '3px 8px',
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                fontSize: '0.75rem',
                boxShadow: '1.5px 1.5px 0px #000',
                transform: 'rotate(2deg)',
              }}
            >
              CP-1042 ✓
            </div>
          </div>
        </div>

        {/* 3 Features Row */}
        <div className="hero-features">
          <div className="hero-feature-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#2563EB' }}>
              <Upload size={18} strokeWidth={2.5} />
              <span className="hero-feature-title">QUICK UPLOAD</span>
            </div>
            <p className="hero-feature-desc">
              Upload your file and set your preferences in seconds.
            </p>
          </div>

          <div className="hero-feature-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669' }}>
              <ShieldCheck size={18} strokeWidth={2.5} />
              <span className="hero-feature-title">SECURE PAYMENT</span>
            </div>
            <p className="hero-feature-desc">
              Pay online or at the counter. It's up to you.
            </p>
          </div>

          <div className="hero-feature-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#D97706' }}>
              <CheckCircle2 size={18} strokeWidth={2.5} />
              <span className="hero-feature-title">PICK UP & GO</span>
            </div>
            <p className="hero-feature-desc">
              Get your unique token and collect your print job.
            </p>
          </div>
        </div>
      </div>

      {/* Right Column: Auth Card */}
      <div>
        <LoginCard />
      </div>
    </div>
  );
}
