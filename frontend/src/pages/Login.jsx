import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { HeroIllustration } from '../components/Illustration.jsx';
import { Button } from '../components/Button.jsx';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const user = await login(email, password);
      navigate(user.role === 'staff' ? '/staff' : '/');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container">
      <div className="hero-split">
        <div className="hero-copy">
          <span className="eyebrow">UPLOAD. PAY. PICK UP.</span>
          <h1>PRINT WITHOUT THE QUEUE.</h1>
          <p className="lede">
            Upload your document. Choose your print options. Pay. Pick it up when it's ready.
          </p>

          <div className="card" style={{ marginTop: 28, maxWidth: 440 }}>
            <h2>Log In</h2>
            <form onSubmit={onSubmit}>
              <div className="field">
                <label>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
              </div>
              <div className="field">
                <label>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              {error && <p className="error-text">{error}</p>}
              <Button type="submit" className="btn-block" disabled={busy}>
                {busy ? 'Logging in…' : 'Log In →'}
              </Button>
            </form>
            <p style={{ marginTop: 16 }}>
              Don't have an account? <Link to="/signup"><strong>SIGN UP</strong></Link>
            </p>
            <p className="hint">
              Demo: staff@campusprint.demo / staff123 · student@campusprint.demo / student123
            </p>
          </div>
        </div>

        <div className="hero-illustration">
          <HeroIllustration />
        </div>
      </div>
    </div>
  );
}
