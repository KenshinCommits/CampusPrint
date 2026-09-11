import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { ArrowRight, User, Mail, Lock, ShieldAlert } from 'lucide-react';

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
    <div style={{ maxWidth: '480px', margin: '40px auto' }}>
      <div className="neo-card">
        <div style={{ marginBottom: '20px' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 900 }}>
            Create Account
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Join CampusPrint to bypass the print shop line
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

        <form onSubmit={onSubmit}>
          <div className="neo-input-group">
            <label className="neo-label">
              <User size={15} />
              <span>Full Name</span>
            </label>
            <input
              type="text"
              className="neo-input"
              placeholder="e.g. Rahul Kumar"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="neo-input-group">
            <label className="neo-label">
              <Mail size={15} />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              className="neo-input"
              placeholder="e.g. rahul@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="neo-input-group">
            <label className="neo-label">
              <Lock size={15} />
              <span>Password</span>
            </label>
            <input
              type="password"
              className="neo-input"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="neo-input-group">
            <label className="neo-label">
              <span>Account Type</span>
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                className={`neo-btn sm ${role === 'student' ? 'primary' : ''}`}
                style={{ flex: 1 }}
                onClick={() => setRole('student')}
              >
                Student
              </button>
              <button
                type="button"
                className={`neo-btn sm ${role === 'staff' ? 'primary' : ''}`}
                style={{ flex: 1 }}
                onClick={() => setRole('staff')}
              >
                Staff
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="neo-btn primary full-width"
            disabled={busy}
            style={{ marginTop: '12px', padding: '12px' }}
          >
            <span>{busy ? 'CREATING ACCOUNT…' : 'SIGN UP ->'}</span>
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
          Already have an account?{' '}
          <Link
            to="/login"
            style={{ color: '#000', fontWeight: 800, textDecoration: 'underline' }}
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
