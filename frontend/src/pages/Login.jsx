import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { PixelLogo, PixelPrinter, PixelPrinterGraphic, PixelSparkles } from '../components/PixelArt.jsx';
import { NeoCard, NeoButton } from '../components/ui/index.js';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';

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
    <div
      style={{
        minHeight: 'calc(100vh - 56px)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        backgroundColor: '#FBF8F1',
      }}
    >
      {/* Left Column: Deep retro navy (#001D3D and #000814) Hero Showcase */}
      <div
        style={{
          background: 'linear-gradient(180deg, #001D3D 0%, #000814 100%)',
          padding: 'clamp(32px, 6vw, 64px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
          borderRight: '2px solid #000814',
        }}
      >
        {/* Top Pixel Logo & Corner Sparkles */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px' }}>
            <PixelLogo size={32} color="#FFC300" />
            <span
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: '1rem',
                letterSpacing: '0.02em',
                color: '#FFFFFF',
              }}
            >
              CAMPUS<span style={{ color: '#FFD60A' }}>PRINT</span>
            </span>
          </div>

          <PixelSparkles color1="#FFC300" color2="#38BDF8" />
        </div>

        {/* Hero Big Typography & Tagline */}
        <div style={{ margin: '40px 0' }}>
          <h1
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 'clamp(1.6rem, 3.6vw, 2.6rem)',
              lineHeight: 1.35,
              letterSpacing: '0.02em',
              color: '#FFFFFF',
              marginBottom: '24px',
            }}
          >
            PRINT.<br />
            PAY.<br />
            <span style={{ color: '#FFD60A' }}>PICK UP.</span>
          </h1>

          <p
            style={{
              color: '#94A3B8',
              fontSize: 'clamp(0.9rem, 1.3vw, 1.05rem)',
              maxWidth: '420px',
              lineHeight: 1.7,
              fontFamily: 'monospace',
              fontWeight: 500,
            }}
          >
            Upload your document.<br />
            Choose your print options.<br />
            Pay in seconds.<br />
            Pick it up from the shop.
          </p>
        </div>

        {/* Pixel Art Printer Illustration */}
        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center' }}>
          <PixelPrinterGraphic size={240} />
        </div>
      </div>

      {/* Right Column: Warm Cream Login Card Area */}
      <div
        style={{
          backgroundColor: '#FBF8F1',
          padding: 'clamp(32px, 5vw, 64px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            maxWidth: '460px',
            width: '100%',
            backgroundColor: '#FFFFFF',
            border: '4px solid #000814',
            boxShadow: '6px 6px 0px 0px #000814',
            borderRadius: 0,
            padding: '36px 32px',
          }}
        >
          {/* Role Toggle Selector: [Student] | [Staff] */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              backgroundColor: '#001D3D',
              border: '2px solid #000814',
              borderRadius: 0,
              padding: '4px',
              marginBottom: '26px',
              boxShadow: '3px 3px 0px 0px #000814',
              gap: '4px',
            }}
          >
            <button
              type="button"
              onClick={() => handleRoleToggle('student')}
              style={{
                padding: '10px',
                border: roleSelection === 'student' ? '2px solid #000814' : '2px solid transparent',
                borderRadius: 0,
                fontFamily: "'Silkscreen', monospace",
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                backgroundColor: roleSelection === 'student' ? '#FFC300' : 'transparent',
                color: roleSelection === 'student' ? '#000814' : '#FFFFFF',
                boxShadow: roleSelection === 'student' ? '2px 2px 0px 0px #000814' : 'none',
                transition: 'none',
                textTransform: 'uppercase',
              }}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => handleRoleToggle('staff')}
              style={{
                padding: '10px',
                border: roleSelection === 'staff' ? '2px solid #000814' : '2px solid transparent',
                borderRadius: 0,
                fontFamily: "'Silkscreen', monospace",
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                backgroundColor: roleSelection === 'staff' ? '#FFC300' : 'transparent',
                color: roleSelection === 'staff' ? '#000814' : '#FFFFFF',
                boxShadow: roleSelection === 'staff' ? '2px 2px 0px 0px #000814' : 'none',
                transition: 'none',
                textTransform: 'uppercase',
              }}
            >
              Staff
            </button>
          </div>

          {/* Heading */}
          <div style={{ marginBottom: '22px' }}>
            <h2
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontWeight: 400,
                fontSize: '1.25rem',
                lineHeight: 1.4,
                letterSpacing: '0.02em',
                marginBottom: '8px',
                color: '#000814',
              }}
            >
              WELCOME BACK!
            </h2>
            <p style={{ color: '#4B5563', fontSize: '0.85rem', fontFamily: 'monospace', fontWeight: 500 }}>
              Log in to access your campus print station
            </p>
          </div>

          {error && (
            <div
              style={{
                backgroundColor: '#FECACA',
                border: '2px solid #000814',
                borderRadius: 0,
                boxShadow: '3px 3px 0px 0px #000814',
                padding: '10px 14px',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#991B1B',
                marginBottom: '18px',
                fontFamily: 'monospace',
              }}
            >
              {error}
            </div>
          )}

          {/* Quick Demo Accounts for Judges & Evaluators */}
          <div
            style={{
              backgroundColor: '#FFFDEB',
              border: '2px solid #000814',
              borderRadius: 0,
              padding: '12px',
              marginBottom: '20px',
              boxShadow: '3px 3px 0px 0px #000814',
            }}
          >
            <div
              style={{
                fontFamily: "'Silkscreen', monospace",
                fontWeight: 700,
                fontSize: '0.74rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '10px',
                textTransform: 'uppercase',
                color: '#000814',
              }}
            >
              <Sparkles size={16} color="#FFC300" />
              <span>Judges One-Click Logins:</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                disabled={busy}
                onClick={() => handleQuickLogin('student@campusprint.demo', 'student123', 'student')}
                style={{
                  backgroundColor: '#BAE6FD',
                  border: '2px solid #000814',
                  borderRadius: 0,
                  boxShadow: '2px 2px 0px 0px #000814',
                  textAlign: 'left',
                  padding: '7px 8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                  cursor: 'pointer',
                  fontFamily: "'Silkscreen', monospace",
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.72rem', color: '#000814' }}>Demo Student</div>
                <div style={{ fontSize: '0.65rem', color: '#003566', fontFamily: 'monospace' }}>order in progress</div>
              </button>

              <button
                type="button"
                disabled={busy}
                onClick={() => handleQuickLogin('staff@campusprint.demo', 'staff123', 'staff')}
                style={{
                  backgroundColor: '#FFD60A',
                  border: '2px solid #000814',
                  borderRadius: 0,
                  boxShadow: '2px 2px 0px 0px #000814',
                  textAlign: 'left',
                  padding: '7px 8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                  cursor: 'pointer',
                  fontFamily: "'Silkscreen', monospace",
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.72rem', color: '#000814' }}>Shop Staff</div>
                <div style={{ fontSize: '0.65rem', color: '#001D3D', fontFamily: 'monospace' }}>queue &amp; manager</div>
              </button>

              <button
                type="button"
                disabled={busy}
                onClick={() => handleQuickLogin('ananya@campusprint.demo', 'demo123', 'student')}
                style={{
                  backgroundColor: '#86EFAC',
                  border: '2px solid #000814',
                  borderRadius: 0,
                  boxShadow: '2px 2px 0px 0px #000814',
                  textAlign: 'left',
                  padding: '7px 8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                  cursor: 'pointer',
                  fontFamily: "'Silkscreen', monospace",
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.72rem', color: '#000814' }}>Ananya Iyer</div>
                <div style={{ fontSize: '0.65rem', color: '#003566', fontFamily: 'monospace' }}>ready order (resume)</div>
              </button>

              <button
                type="button"
                disabled={busy}
                onClick={() => handleQuickLogin('karthik@campusprint.demo', 'demo123', 'student')}
                style={{
                  backgroundColor: '#C7D2FE',
                  border: '2px solid #000814',
                  borderRadius: 0,
                  boxShadow: '2px 2px 0px 0px #000814',
                  textAlign: 'left',
                  padding: '7px 8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                  cursor: 'pointer',
                  fontFamily: "'Silkscreen', monospace",
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.72rem', color: '#000814' }}>Karthik Rao</div>
                <div style={{ fontSize: '0.65rem', color: '#001D3D', fontFamily: 'monospace' }}>capstone project</div>
              </button>
            </div>

            <div style={{ marginTop: '8px', fontSize: '0.68rem', color: '#6B7280', textAlign: 'center', fontFamily: 'monospace', fontWeight: 600 }}>
              &gt; Select any demo user above to enter
            </div>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label
                htmlFor="auth-email"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontFamily: "'Silkscreen', monospace",
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  marginBottom: '6px',
                  color: '#000814',
                }}
              >
                <Mail size={14} />
                <span>Email address</span>
              </label>
              <input
                id="auth-email"
                type="email"
                required
                placeholder="name@campus.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  height: '44px',
                  backgroundColor: '#FFFFFF',
                  border: '2px solid #000814',
                  borderRadius: 0,
                  boxShadow: '3px 3px 0px 0px #000814',
                  padding: '0 14px',
                  fontFamily: 'monospace',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label
                htmlFor="auth-password"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontFamily: "'Silkscreen', monospace",
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  marginBottom: '6px',
                  color: '#000814',
                }}
              >
                <Lock size={14} />
                <span>Password</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    height: '44px',
                    backgroundColor: '#FFFFFF',
                    border: '2px solid #000814',
                    borderRadius: 0,
                    boxShadow: '3px 3px 0px 0px #000814',
                    padding: '0 42px 0 14px',
                    fontFamily: 'monospace',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    outline: 'none',
                  }}
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
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', fontFamily: 'monospace' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 600 }}>
                <input type="checkbox" defaultChecked style={{ accentColor: '#000814' }} />
                <span>Remember me</span>
              </label>
              <a href="#forgot" style={{ color: '#000814', fontWeight: 700, textDecoration: 'underline' }}>
                Forgot password?
              </a>
            </div>

            {/* "LOG IN ->" 3D Beveled Arcade Yellow Button */}
            <button
              type="submit"
              disabled={busy}
              className="pixel-btn-arcade"
              style={{
                width: '100%',
                padding: '14px 18px',
                fontSize: '11px',
              }}
            >
              <span>{busy ? 'LOGGING IN…' : 'LOG IN ->'}</span>
              <ArrowRight size={16} strokeWidth={3} />
            </button>
          </form>

          <div
            style={{
              marginTop: '24px',
              paddingTop: '20px',
              borderTop: '2px dashed #000814',
              textAlign: 'center',
              fontSize: '0.82rem',
              fontFamily: 'monospace',
              fontWeight: 600,
            }}
          >
            <span>Don't have an account? </span>
            <Link to="/signup" style={{ color: '#000814', fontWeight: 800, textDecoration: 'underline' }}>
              Create Account &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
