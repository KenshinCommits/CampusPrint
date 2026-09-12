import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Printer, Upload, ShieldCheck, CheckCircle2, ArrowRight, Sparkles, Mail, Lock } from 'lucide-react';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [roleSelection, setRoleSelection] = useState('student');
  const [email, setEmail] = useState('student@campusprint.demo');
  const [password, setPassword] = useState('student123');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  function handleRoleToggle(role) {
    setRoleSelection(role);
    if (role === 'student') {
      setEmail('student@campusprint.demo');
      setPassword('student123');
    } else {
      setEmail('staff@campusprint.demo');
      setPassword('staff123');
    }
  }

  async function onSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const user = await login(email, password);
      navigate(user.role === 'staff' ? '/staff' : '/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setBusy(false);
    }
  }

  async function handleQuickLogin(targetEmail, targetPassword, role) {
    setEmail(targetEmail);
    setPassword(targetPassword);
    setRoleSelection(role);
    setError('');
    setBusy(true);
    try {
      const user = await login(targetEmail, targetPassword);
      navigate(user.role === 'staff' ? '/staff' : '/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setBusy(false);
    }
  }

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
          <button
            className="neo-btn primary"
            onClick={() => document.getElementById('auth-email')?.focus()}
          >
            <span>GET STARTED</span>
            <ArrowRight size={18} strokeWidth={2.5} />
          </button>
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
        <div className="neo-card" style={{ maxWidth: '440px', margin: '0 auto' }}>
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 900 }}>
              Welcome Back!
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Login to your account
            </p>
          </div>

          {error && (
            <div
              style={{
                background: '#FEE2E2',
                border: '2px solid #EF4444',
                color: '#991B1B',
                borderRadius: '6px',
                padding: '10px 14px',
                marginBottom: '16px',
                fontSize: '0.88rem',
                fontWeight: 600,
              }}
            >
              {error}
            </div>
          )}

          {/* Quick Demo Accounts for Judges & Evaluators */}
          <div
            style={{
              background: '#FEF9C3',
              border: '2.5px solid #000',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '18px',
              boxShadow: '3px 3px 0px #000',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 900,
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '8px',
                textTransform: 'uppercase',
                color: '#854D0E',
              }}
            >
              <Sparkles size={16} />
              <span>⚡ Judges One-Click Demo Logins:</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                className="neo-btn sm"
                disabled={busy}
                onClick={() => handleQuickLogin('student@campusprint.demo', 'student123', 'student')}
                style={{
                  background: '#DBEAFE',
                  textAlign: 'left',
                  padding: '7px 8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                }}
              >
                <div style={{ fontWeight: 800, fontSize: '0.78rem' }}>👨‍🎓 Demo Student</div>
                <div style={{ fontSize: '0.68rem', color: '#475569' }}>order in progress</div>
              </button>

              <button
                type="button"
                className="neo-btn sm"
                disabled={busy}
                onClick={() => handleQuickLogin('staff@campusprint.demo', 'staff123', 'staff')}
                style={{
                  background: '#FDE047',
                  textAlign: 'left',
                  padding: '7px 8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                }}
              >
                <div style={{ fontWeight: 800, fontSize: '0.78rem' }}>👩‍💼 Shop Staff</div>
                <div style={{ fontSize: '0.68rem', color: '#475569' }}>queue & analytics</div>
              </button>

              <button
                type="button"
                className="neo-btn sm"
                disabled={busy}
                onClick={() => handleQuickLogin('ananya@campusprint.demo', 'demo123', 'student')}
                style={{
                  background: '#DCFCE7',
                  textAlign: 'left',
                  padding: '7px 8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                }}
              >
                <div style={{ fontWeight: 800, fontSize: '0.78rem' }}>📄 Ananya Iyer</div>
                <div style={{ fontSize: '0.68rem', color: '#475569' }}>ready order (resume)</div>
              </button>

              <button
                type="button"
                className="neo-btn sm"
                disabled={busy}
                onClick={() => handleQuickLogin('karthik@campusprint.demo', 'demo123', 'student')}
                style={{
                  background: '#F3E8FF',
                  textAlign: 'left',
                  padding: '7px 8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                }}
              >
                <div style={{ fontWeight: 800, fontSize: '0.78rem' }}>📘 Karthik Rao</div>
                <div style={{ fontSize: '0.68rem', color: '#475569' }}>capstone project</div>
              </button>
            </div>

            <div style={{ marginTop: '7px', fontSize: '0.7rem', color: '#713F12', textAlign: 'center', fontWeight: 600 }}>
              👆 Click any role to log in instantly
            </div>
          </div>

          <form onSubmit={onSubmit}>
            <div className="neo-input-group">
              <label className="neo-label" htmlFor="auth-email">
                <Mail size={15} />
                <span>Email address</span>
              </label>
              <input
                id="auth-email"
                type="email"
                className="neo-input"
                placeholder="student@campusprint.demo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="neo-input-group">
              <label className="neo-label" htmlFor="auth-password">
                <Lock size={15} />
                <span>Password</span>
              </label>
              <input
                id="auth-password"
                type="password"
                className="neo-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="neo-btn primary full-width"
              disabled={busy}
              style={{ marginTop: '8px', padding: '12px' }}
            >
              <span>{busy ? 'LOGGING IN…' : 'LOG IN'}</span>
              <ArrowRight size={18} strokeWidth={2.5} />
            </button>
          </form>

          <div
            style={{
              marginTop: '16px',
              textAlign: 'center',
              fontSize: '0.88rem',
              color: 'var(--text-muted)',
            }}
          >
            Don't have an account?{' '}
            <Link
              to="/signup"
              style={{ color: '#000', fontWeight: 800, textDecoration: 'underline' }}
            >
              Sign Up
            </Link>
          </div>

          <div style={{ marginTop: '24px', borderTop: '2px dashed #000', paddingTop: '16px' }}>
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.8rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                marginBottom: '8px',
              }}
            >
              I am a:
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                className={`neo-btn sm ${roleSelection === 'student' ? 'primary' : ''}`}
                style={{ flex: 1 }}
                onClick={() => handleRoleToggle('student')}
              >
                Student
              </button>
              <button
                type="button"
                className={`neo-btn sm ${roleSelection === 'staff' ? 'primary' : ''}`}
                style={{ flex: 1 }}
                onClick={() => handleRoleToggle('staff')}
              >
                Staff
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
