import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';

export function LoginCard({ title = 'Welcome Back!', subtitle = 'Login to your account' }) {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('student@campusprint.demo');
  const [password, setPassword] = useState('student123');
  const [roleSelection, setRoleSelection] = useState('student');
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

  async function handleQuickLogin(quickEmail, quickPassword, targetRole) {
    setBusy(true);
    setError('');
    try {
      const user = await login(quickEmail, quickPassword);
      if (user.role === 'staff') {
        navigate('/staff');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Quick login failed');
    } finally {
      setBusy(false);
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const user = await login(email, password);
      if (user.role === 'staff') {
        navigate('/staff');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="neo-card" style={{ maxWidth: '440px', width: '100%', margin: '0 auto', background: '#fff' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 900 }}>
          {title}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          {subtitle}
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
  );
}
