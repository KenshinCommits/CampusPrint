import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <Link to="/" className="brand">
        🖨️ CampusPrint
      </Link>
      <div className="nav-links">
        {!user && (
          <>
            <Link to="/login">Log in</Link>
            <Link to="/signup" className="btn-link">
              Sign up
            </Link>
          </>
        )}
        {user && user.role === 'student' && (
          <>
            <Link to="/new-order">New order</Link>
            <Link to="/my-orders">My orders</Link>
          </>
        )}
        {user && user.role === 'staff' && <Link to="/staff">Staff dashboard</Link>}
        {user && (
          <>
            <span className="who">
              {user.name} ({user.role})
            </span>
            <button
              className="btn-link"
              onClick={() => {
                logout();
                navigate('/login');
              }}
            >
              Log out
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
