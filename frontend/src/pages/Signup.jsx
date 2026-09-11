import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Button } from '../components/Button.jsx';
import { OptionCard } from '../components/OptionCard.jsx';

export function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const user = await signup(form);
      navigate(user.role === 'staff' ? '/staff' : '/');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container narrow">
      <div className="card" style={{ margin: '20px auto' }}>
        <span className="eyebrow">JOIN CAMPUSPRINT</span>
        <h1 style={{ marginTop: 10 }}>SIGN UP</h1>
        <form onSubmit={onSubmit}>
          <div className="field">
            <label>Name</label>
            <input value={form.name} onChange={(e) => update('name', e.target.value)} required />
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} required />
          </div>
          <div className="field">
            <label>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => update('password', e.target.value)}
              required
              minLength={6}
            />
            <span className="field-hint">At least 6 characters</span>
          </div>
          <div className="field">
            <label>I am a</label>
            <div className="option-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <OptionCard title="Student" sub="Order prints" selected={form.role === 'student'} onClick={() => update('role', 'student')} />
              <OptionCard title="Shop Staff" sub="Run the queue" selected={form.role === 'staff'} onClick={() => update('role', 'staff')} tone="blue" />
            </div>
          </div>
          {error && <p className="error-text">{error}</p>}
          <Button type="submit" className="btn-block" disabled={busy}>
            {busy ? 'Creating account…' : 'Create Account →'}
          </Button>
        </form>
        <p style={{ marginTop: 16 }}>
          Already have an account? <Link to="/login"><strong>LOG IN</strong></Link>
        </p>
      </div>
    </div>
  );
}
