import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { PixelLogo, PixelPrinter, PixelSparkles } from '../components/PixelArt.jsx';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [roleSelection, setRoleSelection] = useState('student');
  const [email, setEmail] = useState('student@campusprint.demo');
  const [password, setPassword] = useState('student123');
  const [showPassword, setShowPassword] = useState(false);
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
    e.preventDefault();
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
        {/* Top Pixel Logo & Corner Sparkles */}
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

        {/* Hero Big Typography & Tagline */}
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
            PRINT.<br />
            PAY.<br />
            <span style={{ color: '#FFD028' }}>PICK UP.</span>
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
            Upload your document.<br />
            Choose your print options.<br />
            Pay.<br />
            Pick it up when it's ready.
          </p>
        </div>

        {/* Pixel Art Printer Illustration */}
        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center' }}>
          <PixelPrinter width={300} height={220} />
        </div>
      </div>

      {/* Right Column: Warm Cream Login Card Area */}
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
            maxWidth: '440px',
            width: '100%',
            padding: '36px 32px',
            background: '#FFFFFF',
          }}
        >
          {/* Student vs Staff Toggle Switch */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              background: '#FFF',
              border: '2px solid #000',
              borderRadius: '8px',
              padding: '3px',
              marginBottom: '28px',
              boxShadow: '2px 2px 0px #000',
            }}
          >
            <button
              type="button"
              onClick={() => handleRoleToggle('student')}
              style={{
                padding: '8px',
                border: 'none',
                borderRadius: '6px',
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                fontSize: '0.88rem',
                cursor: 'pointer',
                background: roleSelection === 'student' ? '#FFD028' : 'transparent',
                color: '#000',
                transition: 'all 0.1s ease',
              }}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => handleRoleToggle('staff')}
              style={{
                padding: '8px',
                border: 'none',
                borderRadius: '6px',
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                fontSize: '0.88rem',
                cursor: 'pointer',
                background: roleSelection === 'staff' ? '#FFD028' : 'transparent',
                color: '#000',
                transition: 'all 0.1s ease',
              }}
            >
              Staff
            </button>
          </div>

          {/* Heading */}
          <div style={{ marginBottom: '24px' }}>
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 900,
                fontSize: '1.7rem',
                letterSpacing: '-0.02em',
                marginBottom: '4px',
              }}
            >
              Welcome Back!
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Log in to your account
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

          {/* Form */}
          <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div className="neo-input-group" style={{ marginBottom: 0 }}>
              <label className="neo-label" htmlFor="auth-email">
                <Mail size={14} />
                <span>Email address</span>
              </label>
              <input
                id="auth-email"
                type="email"
                required
                className="neo-input"
                placeholder="name@campus.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="neo-input-group" style={{ marginBottom: 0 }}>
              <label className="neo-label" htmlFor="auth-password">
                <Lock size={14} />
                <span>Password</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="neo-input"
                  style={{ paddingRight: '40px' }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#6B7280',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="neo-btn primary full-width"
              style={{
                marginTop: '10px',
                padding: '12px',
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <span>{busy ? 'LOGGING IN…' : 'LOG IN'}</span>
              <ArrowRight size={18} strokeWidth={2.5} />
            </button>
          </form>

          {/* Footer Link */}
          <div
            style={{
              textAlign: 'center',
              marginTop: '24px',
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
            }}
          >
            Don't have an account?{' '}
            <Link
              to="/signup"
              style={{
                color: '#000',
                fontWeight: 800,
                textDecoration: 'underline',
              }}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
