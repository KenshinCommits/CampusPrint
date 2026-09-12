import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { PixelLogo, PixelPrinter, PixelSparkles } from '../components/PixelArt.jsx';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';

export function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const user = await signup({ name, email, password, role });
      navigate(user.role === 'staff' ? '/staff' : '/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 52px)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        background: '#FBF8F1',
      }}
    >
      {/* Left Column: Retro Dark Navy Hero Showcase */}
      <div
        style={{
          background: '#0B132B',
          padding: 'clamp(32px, 6vw, 64px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
          borderRight: '2px solid #000',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
            <PixelLogo size={28} color="#FFD028" />
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.25rem',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                color: '#FFF',
              }}
            >
              CAMPUSPRINT
            </span>
          </div>

          <PixelSparkles color1="#FFD028" color2="#38BDF8" />
        </div>

        <div style={{ margin: '40px 0' }}>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.5rem, 5.5vw, 4.2rem)',
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              color: '#FFFFFF',
              marginBottom: '20px',
            }}
          >
            SKIP THE LINE.<br />
            PRINT FROM<br />
            <span style={{ color: '#FFD028' }}>ANYWHERE.</span>
          </h1>

          <p
            style={{
              color: '#94A3B8',
              fontSize: 'clamp(0.95rem, 1.5vw, 1.15rem)',
              maxWidth: '380px',
              lineHeight: 1.6,
              fontWeight: 500,
            }}
          >
            Create an account to upload documents, customize print specs, and track pickup orders in real time.
          </p>
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center' }}>
          <PixelPrinter width={300} height={220} />
        </div>
      </div>

      {/* Right Column: Warm Cream Register Card */}
      <div
        style={{
          background: '#FBF8F1',
          padding: 'clamp(32px, 5vw, 64px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          className="neo-card"
          style={{
            maxWidth: '460px',
            width: '100%',
            padding: '36px 32px',
            background: '#FFFFFF',
          }}
        >
          {/* Role Toggle */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              background: '#FFF',
              border: '2px solid #000',
              borderRadius: '8px',
              padding: '3px',
              marginBottom: '24px',
              boxShadow: '2px 2px 0px #000',
            }}
          >
            <button
              type="button"
              onClick={() => setRole('student')}
              style={{
                padding: '8px',
                border: 'none',
                borderRadius: '6px',
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                fontSize: '0.88rem',
                cursor: 'pointer',
                background: role === 'student' ? '#FFD028' : 'transparent',
                color: '#000',
                transition: 'all 0.1s ease',
              }}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole('staff')}
              style={{
                padding: '8px',
                border: 'none',
                borderRadius: '6px',
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                fontSize: '0.88rem',
                cursor: 'pointer',
                background: role === 'staff' ? '#FFD028' : 'transparent',
                color: '#000',
                transition: 'all 0.1s ease',
              }}
            >
              Staff
            </button>
          </div>

          <div style={{ marginBottom: '22px' }}>
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 900,
                fontSize: '1.7rem',
                letterSpacing: '-0.02em',
                marginBottom: '4px',
              }}
            >
              Create Account
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Sign up as a {role} to get started
            </p>
          </div>

          {error && (
            <div
              style={{
                background: '#FECACA',
                border: '2px solid #000',
                borderRadius: '6px',
                padding: '10px 14px',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#991B1B',
                marginBottom: '18px',
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="neo-input-group" style={{ marginBottom: 0 }}>
              <label className="neo-label">
                <User size={14} />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                required
                className="neo-input"
                placeholder="e.g. Rahul Kumar"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="neo-input-group" style={{ marginBottom: 0 }}>
              <label className="neo-label">
                <Mail size={14} />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                required
                className="neo-input"
                placeholder="name@campus.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="neo-input-group" style={{ marginBottom: 0 }}>
              <label className="neo-label">
                <Lock size={14} />
                <span>Password</span>
              </label>
              <input
                type="password"
                required
                className="neo-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={busy}
              className="neo-btn primary full-width"
              style={{
                marginTop: '8px',
                padding: '12px',
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <span>{busy ? 'CREATING ACCOUNT…' : 'CREATE ACCOUNT'}</span>
              <ArrowRight size={18} strokeWidth={2.5} />
            </button>
          </form>

          <div
            style={{
              textAlign: 'center',
              marginTop: '22px',
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
            }}
          >
            Already have an account?{' '}
            <Link
              to="/login"
              style={{
                color: '#000',
                fontWeight: 800,
                textDecoration: 'underline',
              }}
            >
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
