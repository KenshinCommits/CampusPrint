import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { PixelLogo, PixelPrinter, PixelSparkles } from '../components/PixelArt.jsx';
import { NeoCard, NeoButton } from '../components/ui/index.js';
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
          borderRight: '2px solid #000000',
        }}
      >
        {/* Top Pixel Logo & Corner Sparkles */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
            <PixelLogo size={32} color="#FFC300" />
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.35rem',
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
        <div style={{ margin: '40px 0' }}>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.6rem, 5.5vw, 4.4rem)',
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              color: '#FFFFFF',
              marginBottom: '22px',
            }}
          >
            PRINT.<br />
            PAY.<br />
            <span style={{ color: '#FFC300' }}>PICK UP.</span>
          </h1>

          <p
            style={{
              color: '#94A3B8',
              fontSize: 'clamp(1rem, 1.6vw, 1.2rem)',
              maxWidth: '400px',
              lineHeight: 1.6,
              fontWeight: 600,
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
          <PixelPrinter width={320} height={230} />
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
        <NeoCard
          variant="default"
          style={{
            maxWidth: '440px',
            width: '100%',
            padding: '36px 32px',
          }}
        >
          {/* Role Toggle Selector: [Student] | [Staff] */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              backgroundColor: '#FFFFFF',
              border: '2px solid #000000',
              borderRadius: '12px',
              padding: '4px',
              marginBottom: '28px',
              boxShadow: '3px 3px 0px 0px #000000',
            }}
          >
            <button
              type="button"
              onClick={() => handleRoleToggle('student')}
              style={{
                padding: '10px',
                border: roleSelection === 'student' ? '2px solid #000000' : '2px solid transparent',
                borderRadius: '8px',
                fontFamily: 'var(--font-heading)',
                fontWeight: 900,
                fontSize: '0.88rem',
                cursor: 'pointer',
                backgroundColor: roleSelection === 'student' ? '#FFC300' : 'transparent',
                color: '#000000',
                boxShadow: roleSelection === 'student' ? '2px 2px 0px 0px #000000' : 'none',
                transition: 'all 0.1s ease',
              }}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => handleRoleToggle('staff')}
              style={{
                padding: '10px',
                border: roleSelection === 'staff' ? '2px solid #000000' : '2px solid transparent',
                borderRadius: '8px',
                fontFamily: 'var(--font-heading)',
                fontWeight: 900,
                fontSize: '0.88rem',
                cursor: 'pointer',
                backgroundColor: roleSelection === 'staff' ? '#FFC300' : 'transparent',
                color: '#000000',
                boxShadow: roleSelection === 'staff' ? '2px 2px 0px 0px #000000' : 'none',
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
                fontSize: '1.8rem',
                letterSpacing: '-0.02em',
                marginBottom: '4px',
                color: '#000000',
              }}
            >
              Welcome Back!
            </h2>
            <p style={{ color: '#4B5563', fontSize: '0.9rem', fontWeight: 600 }}>
              Log in to access your print station
            </p>
          </div>

          {error && (
            <div
              style={{
                backgroundColor: '#FECACA',
                border: '2px solid #000000',
                borderRadius: '10px',
                boxShadow: '2px 2px 0px 0px #000000',
                padding: '10px 14px',
                fontSize: '0.85rem',
                fontWeight: 800,
                color: '#991B1B',
                marginBottom: '18px',
                fontFamily: 'var(--font-heading)',
              }}
            >
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label
                htmlFor="auth-email"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 900,
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  marginBottom: '6px',
                  color: '#000000',
                }}
              >
                <Mail size={15} />
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
                  border: '2px solid #000000',
                  borderRadius: '12px',
                  boxShadow: '3px 3px 0px 0px #000000',
                  padding: '0 14px',
                  fontFamily: 'var(--font-body)',
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
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 900,
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  marginBottom: '6px',
                  color: '#000000',
                }}
              >
                <Lock size={15} />
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
                    border: '2px solid #000000',
                    borderRadius: '12px',
                    boxShadow: '3px 3px 0px 0px #000000',
                    padding: '0 42px 0 14px',
                    fontFamily: 'var(--font-body)',
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

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 600 }}>
                <input type="checkbox" defaultChecked style={{ accentColor: '#000000' }} />
                <span>Remember me</span>
              </label>
              <a href="#forgot" style={{ color: '#000000', fontWeight: 800, textDecoration: 'underline' }}>
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
                color: '#000000',
                fontFamily: 'var(--font-heading)',
                fontWeight: 900,
                fontSize: '1.05rem',
                textTransform: 'uppercase',
                padding: '14px',
                borderRadius: '12px',
                border: '2px solid #000000',
                boxShadow: '4px 4px 0px 0px #000000',
                cursor: busy ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'transform 0.08s ease, box-shadow 0.08s ease',
              }}
            >
              <span>{busy ? 'LOGGING IN…' : 'LOG IN ->'}</span>
              <ArrowRight size={18} strokeWidth={3} />
            </button>
          </form>

          <div
            style={{
              marginTop: '24px',
              paddingTop: '20px',
              borderTop: '2px dashed #000000',
              textAlign: 'center',
              fontSize: '0.85rem',
              fontWeight: 600,
            }}
          >
            <span>Don't have an account? </span>
            <Link to="/signup" style={{ color: '#000000', fontWeight: 900, textDecoration: 'underline' }}>
              Create Account &rarr;
            </Link>
          </div>
        </NeoCard>
      </div>
    </div>
  );
}

export default Login;
