import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { PixelLogo, PixelPrinter, PixelPrinterGraphic, PixelSparkles } from '../components/PixelArt.jsx';
import { NeoCard, NeoButton } from '../components/ui/index.js';
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
        minHeight: 'calc(100vh - 56px)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        backgroundColor: '#FBF8F1',
      }}
    >
      {/* Left Column: Retro Dark Navy Hero Showcase */}
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
            SKIP THE LINE.<br />
            PRINT FROM<br />
            <span style={{ color: '#FFC300' }}>ANYWHERE.</span>
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
            Create an account to upload documents, customize print specs, and track pickup orders in real time.
          </p>
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center' }}>
          <PixelPrinterGraphic size={240} />
        </div>
      </div>

      {/* Right Column: Warm Cream Signup Card Area */}
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
          {/* Role Toggle Selector */}
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
              onClick={() => setRole('student')}
              style={{
                padding: '10px',
                border: role === 'student' ? '2px solid #000000' : '2px solid transparent',
                borderRadius: '8px',
                fontFamily: 'var(--font-heading)',
                fontWeight: 900,
                fontSize: '0.88rem',
                cursor: 'pointer',
                backgroundColor: role === 'student' ? '#FFC300' : 'transparent',
                color: '#000000',
                boxShadow: role === 'student' ? '2px 2px 0px 0px #000000' : 'none',
              }}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole('staff')}
              style={{
                padding: '10px',
                border: role === 'staff' ? '2px solid #000000' : '2px solid transparent',
                borderRadius: '8px',
                fontFamily: 'var(--font-heading)',
                fontWeight: 900,
                fontSize: '0.88rem',
                cursor: 'pointer',
                backgroundColor: role === 'staff' ? '#FFC300' : 'transparent',
                color: '#000000',
                boxShadow: role === 'staff' ? '2px 2px 0px 0px #000000' : 'none',
              }}
            >
              Staff
            </button>
          </div>

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
              Create Account
            </h2>
            <p style={{ color: '#4B5563', fontSize: '0.9rem', fontWeight: 600 }}>
              Join CampusPrint in 10 seconds
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

          <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label
                htmlFor="signup-name"
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
                <User size={15} />
                <span>Full Name</span>
              </label>
              <input
                id="signup-name"
                type="text"
                required
                placeholder="Alex Morgan"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                htmlFor="signup-email"
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
                id="signup-email"
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
                htmlFor="signup-password"
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
              <input
                id="signup-password"
                type="password"
                required
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              <span>{busy ? 'CREATING ACCOUNT…' : 'CREATE ACCOUNT ->'}</span>
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
            <span>Already registered? </span>
            <Link to="/login" style={{ color: '#000000', fontWeight: 900, textDecoration: 'underline' }}>
              Log in &rarr;
            </Link>
          </div>
        </NeoCard>
      </div>
    </div>
  );
}

export default Signup;
