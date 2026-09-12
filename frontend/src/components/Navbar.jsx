import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Printer, Bell, LogOut, FileText, LayoutDashboard, Clock, PlusCircle } from 'lucide-react';

export function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  // Get user initials
  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'U';

  const isStaff = user?.role === 'staff';

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to={user ? (isStaff ? '/staff' : '/dashboard') : '/login'} className="brand-badge">
          <Printer size={20} strokeWidth={2.5} />
          <span>CAMPUSPRINT</span>
        </Link>

        {user && (
          <div className="nav-links">
            {!isStaff ? (
              <>
                <Link
                  to="/dashboard"
                  className={`nav-link ${location.pathname === '/dashboard' || location.pathname === '/' ? 'active' : ''}`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/order"
                  className={`nav-link ${location.pathname === '/order' || location.pathname === '/new-order' ? 'active' : ''}`}
                >
                  New Order
                </Link>
                <Link
                  to="/orders"
                  className={`nav-link ${location.pathname === '/orders' || location.pathname === '/my-orders' ? 'active' : ''}`}
                >
                  My Orders
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/staff?tab=queue"
                  className={`nav-link ${location.pathname === '/staff' && (new URLSearchParams(location.search).get('tab') || 'queue') === 'queue' ? 'active' : ''}`}
                >
                  Queue
                </Link>
                <Link
                  to="/staff?tab=orders"
                  className={`nav-link ${location.pathname === '/staff' && new URLSearchParams(location.search).get('tab') === 'orders' ? 'active' : ''}`}
                >
                  Orders
                </Link>
                <Link
                  to="/staff?tab=stats"
                  className={`nav-link ${location.pathname === '/staff' && new URLSearchParams(location.search).get('tab') === 'stats' ? 'active' : ''}`}
                >
                  Statistics
                </Link>
              </>
            )}
          </div>
        )}
      </div>

      <div className="nav-right">
        {user ? (
          <>
            <button className="nav-bell-btn" title="Notifications" onClick={() => {}}>
              <Bell size={18} strokeWidth={2.2} />
              <span className="nav-bell-dot"></span>
            </button>

            <div className="user-badge">
              <div className={`user-avatar ${isStaff ? 'staff' : 'student'}`}>
                {initials}
              </div>
              <div className="user-info">
                <span className="user-name">{user.name || user.email}</span>
                <span className="user-role-label">{user.role}</span>
              </div>
              <button
                className="btn-logout"
                onClick={handleLogout}
                title="Log out"
              >
                <LogOut size={16} strokeWidth={2.2} />
              </button>
            </div>
          </>
        ) : (
          <div className="nav-links">
            <Link to="/login" className="nav-link">
              Log In
            </Link>
            <Link to="/signup" className="neo-btn primary sm">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
