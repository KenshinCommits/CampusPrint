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
        height: '100vh',
        maxHeight: '100vh',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        backgroundColor: '#FBF8F1',
        overflow: 'hidden',
      }}
    >
      {/* Left Column: Deep retro navy (#001D3D and #000814) Hero Showcase */}
      <div
        style={{
          background: 'linear-gradient(180deg, #001D3D 0%, #000814 100%)',
          padding: 'clamp(16px, 3vh, 36px) clamp(20px, 3.5vw, 44px)',
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
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <PixelLogo size={26} color="#FFC300" />
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.2rem',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                color: '#FFFFFF',
              }}
            >
              CAMPUSPRINT
            </span>
          </div>

          <PixelSparkles color1="#FFC300" color2="#38BDF8" />
        </div>

        {/* Hero Big Typography & Tagline */}
        <div style={{ margin: 'clamp(10px, 2vh, 24px) 0' }}>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 3.8vw, 3.2rem)',
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              color: '#FFFFFF',
              marginBottom: '10px',
            }}
          >
            PRINT.<br />
            PAY.<br />
            <span style={{ color: '#FFC300' }}>PICK UP.</span>
          </h1>

          <p
            style={{
              color: '#94A3B8',
              fontSize: 'clamp(0.85rem, 1.2vw, 1rem)',
              maxWidth: '360px',
              lineHeight: 1.45,
              fontWeight: 600,
            }}
          >
            Upload your document.<br />
            Choose your print options.<br />
            Pay in seconds.<br />
            Pick it up from the shop.
          </p>

          <div style={{ marginTop: '14px' }}>
            <Link
              to="/about"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#FFC300',
                color: '#000814',
                fontFamily: 'var(--font-heading)',
                fontWeight: 900,
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                padding: '7px 14px',
                borderRadius: '8px',
                border: '2px solid #000814',
                boxShadow: '2px 2px 0px 0px #000814',
                textDecoration: 'none',
              }}
            >
              <span>EXPLORE &amp; ABOUT</span>
              <ArrowRight size={14} strokeWidth={3} />
            </Link>
          </div>
        </div>

        {/* Pixel Art Printer Illustration (Compact Size to avoid vertical overflow) */}
        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center' }}>
          <PixelPrinterGraphic size={150} />
        </div>
      </div>

      {/* Right Column: Warm Cream Login Card Area */}
      <div
        style={{
          backgroundColor: '#FBF8F1',
          padding: 'clamp(10px, 2vh, 24px) clamp(16px, 3vw, 32px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        <NeoCard
          variant="default"
          style={{
            maxWidth: '430px',
            width: '100%',
            padding: 'clamp(16px, 2.4vh, 22px) clamp(16px, 2.5vw, 24px)',
            boxShadow: '4px 4px 0px 0px #000814',
          }}
        >
          {/* Role Toggle Selector: [Student] | [Staff] */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              backgroundColor: '#FFFFFF',
              border: '2px solid #000814',
              borderRadius: '10px',
              padding: '3px',
              marginBottom: '10px',
              boxShadow: '2px 2px 0px 0px #000814',
            }}
          >
            <button
              type="button"
              onClick={() => handleRoleToggle('student')}
              style={{
                padding: '6px 8px',
                border: roleSelection === 'student' ? '2px solid #000814' : '2px solid transparent',
                borderRadius: '6px',
                fontFamily: 'var(--font-heading)',
                fontWeight: 900,
                fontSize: '0.82rem',
                cursor: 'pointer',
                backgroundColor: roleSelection === 'student' ? '#FFC300' : 'transparent',
                color: '#000814',
                boxShadow: roleSelection === 'student' ? '2px 2px 0px 0px #000814' : 'none',
                transition: 'all 0.1s ease',
              }}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => handleRoleToggle('staff')}
              style={{
                padding: '6px 8px',
                border: roleSelection === 'staff' ? '2px solid #000814' : '2px solid transparent',
                borderRadius: '6px',
                fontFamily: 'var(--font-heading)',
                fontWeight: 900,
                fontSize: '0.82rem',
                cursor: 'pointer',
                backgroundColor: roleSelection === 'staff' ? '#FFC300' : 'transparent',
                color: '#000814',
                boxShadow: roleSelection === 'staff' ? '2px 2px 0px 0px #000814' : 'none',
                transition: 'all 0.1s ease',
              }}
            >
              Staff
            </button>
          </div>

          {/* Heading */}
          <div style={{ marginBottom: '10px' }}>
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 900,
                fontSize: '1.45rem',
                letterSpacing: '-0.02em',
                marginBottom: '2px',
                color: '#000814',
                lineHeight: 1.15,
              }}
            >
              Welcome Back!
            </h2>
            <p style={{ color: '#4B5563', fontSize: '0.82rem', fontWeight: 600 }}>
              Log in to access your print station
            </p>
          </div>

          {error && (
            <div
              style={{
                backgroundColor: '#FECACA',
                border: '2px solid #DC2626',
                borderRadius: '8px',
                padding: '8px 10px',
                marginBottom: '10px',
                color: '#991B1B',
                fontSize: '0.78rem',
                fontWeight: 700,
                boxShadow: '2px 2px 0px 0px #DC2626',
              }}
            >
              {error}
            </div>
          )}

          {/* Quick Login Bar for Judges & Evaluators */}
          <div
            style={{
              backgroundColor: '#FEF9C3',
              border: '2px solid #000814',
              borderRadius: '10px',
              padding: '8px 10px',
              marginBottom: '10px',
              boxShadow: '2px 2px 0px 0px #000814',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontFamily: 'var(--font-heading)',
                fontWeight: 900,
                fontSize: '0.7rem',
                textTransform: 'uppercase',
                color: '#854D0E',
                marginBottom: '5px',
              }}
            >
              <Sparkles size={13} color="#854D0E" />
              <span>Judges One-Click Quick Logins:</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
              <button
                type="button"
                disabled={busy}
                onClick={() => handleQuickLogin('staff@campusprint.demo', 'staff123', 'staff')}
                style={{
                  backgroundColor: '#FFD60A',
                  border: '1.5px solid #000814',
                  borderRadius: '5px',
                  boxShadow: '1.5px 1.5px 0px 0px #000814',
                  textAlign: 'left',
                  padding: '5px 7px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                <div style={{ fontWeight: 800, fontSize: '0.72rem', color: '#000814' }}>🖨️ Staff Operator</div>
                <div style={{ fontSize: '0.62rem', color: '#003566', fontWeight: 600 }}>live queue &amp; 3D sim</div>
              </button>

              <button
                type="button"
                disabled={busy}
                onClick={() => handleQuickLogin('student@campusprint.demo', 'student123', 'student')}
                style={{
                  backgroundColor: '#BAE6FD',
                  border: '1.5px solid #000814',
                  borderRadius: '5px',
                  boxShadow: '1.5px 1.5px 0px 0px #000814',
                  textAlign: 'left',
                  padding: '5px 7px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                <div style={{ fontWeight: 800, fontSize: '0.72rem', color: '#000814' }}>🎓 Judge Student</div>
                <div style={{ fontSize: '0.62rem', color: '#003566', fontWeight: 600 }}>dashboard &amp; orders</div>
              </button>

              <button
                type="button"
                disabled={busy}
                onClick={() => handleQuickLogin('ananya@campusprint.demo', 'demo123', 'student')}
                style={{
                  backgroundColor: '#86EFAC',
                  border: '1.5px solid #000814',
                  borderRadius: '5px',
                  boxShadow: '1.5px 1.5px 0px 0px #000814',
                  textAlign: 'left',
                  padding: '5px 7px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                <div style={{ fontWeight: 800, fontSize: '0.72rem', color: '#000814' }}>📄 Ananya Iyer</div>
                <div style={{ fontSize: '0.62rem', color: '#003566', fontWeight: 600 }}>ready order (resume)</div>
              </button>

              <button
                type="button"
                disabled={busy}
                onClick={() => handleQuickLogin('karthik@campusprint.demo', 'demo123', 'student')}
                style={{
                  backgroundColor: '#C7D2FE',
                  border: '1.5px solid #000814',
                  borderRadius: '5px',
                  boxShadow: '1.5px 1.5px 0px 0px #000814',
                  textAlign: 'left',
                  padding: '5px 7px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                <div style={{ fontWeight: 800, fontSize: '0.72rem', color: '#000814' }}>📘 Karthik Rao</div>
                <div style={{ fontSize: '0.62rem', color: '#001D3D', fontWeight: 600 }}>capstone project</div>
              </button>
            </div>

            <div style={{ marginTop: '4px', fontSize: '0.62rem', color: '#6B7280', textAlign: 'center', fontWeight: 700 }}>
              👆 Click any role to log in instantly
            </div>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div>
              <label
                htmlFor="auth-email"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 900,
                  fontSize: '0.72rem',
                  textTransform: 'uppercase',
                  marginBottom: '3px',
                  color: '#000814',
                }}
              >
                <Mail size={13} />
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
                  height: '36px',
                  backgroundColor: '#FFFFFF',
                  border: '2px solid #000814',
                  borderRadius: '8px',
                  boxShadow: '2px 2px 0px 0px #000814',
                  padding: '0 12px',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.86rem',
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
                  gap: '5px',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 900,
                  fontSize: '0.72rem',
                  textTransform: 'uppercase',
                  marginBottom: '3px',
                  color: '#000814',
                }}
              >
                <Lock size={13} />
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
                    height: '36px',
                    backgroundColor: '#FFFFFF',
                    border: '2px solid #000814',
                    borderRadius: '8px',
                    boxShadow: '2px 2px 0px 0px #000814',
                    padding: '0 38px 0 12px',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    outline: 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
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

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', marginTop: '2px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontWeight: 600 }}>
                <input type="checkbox" defaultChecked style={{ accentColor: '#000814' }} />
                <span>Remember me</span>
              </label>
              <a href="#forgot" style={{ color: '#000814', fontWeight: 800, textDecoration: 'underline' }}>
                Forgot password?
              </a>
            </div>

            {/* "LOG IN ->" yellow button */}
            <button
              type="submit"
              disabled={busy}
              style={{
                width: '100%',
                backgroundColor: '#FFC300',
                color: '#000814',
                fontFamily: 'var(--font-heading)',
                fontWeight: 900,
                fontSize: '0.94rem',
                textTransform: 'uppercase',
                padding: '10px 14px',
                borderRadius: '10px',
                border: '2px solid #000814',
                boxShadow: '3px 3px 0px 0px #000814',
                cursor: busy ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                marginTop: '4px',
                transition: 'transform 0.08s ease, box-shadow 0.08s ease',
              }}
            >
              <span>{busy ? 'LOGGING IN…' : 'LOG IN ->'}</span>
              <ArrowRight size={16} strokeWidth={3} />
            </button>
          </form>

          <div
            style={{
              marginTop: '10px',
              paddingTop: '8px',
              borderTop: '2px dashed #000814',
              textAlign: 'center',
              fontSize: '0.78rem',
              fontWeight: 600,
            }}
          >
            <span>Don't have an account? </span>
            <Link to="/signup" style={{ color: '#000814', fontWeight: 900, textDecoration: 'underline' }}>
              Create Account &rarr;
            </Link>
          </div>
        </NeoCard>
      </div>
    </div>
  );
}

export default Login;
