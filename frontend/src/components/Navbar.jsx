import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotifications } from '../context/NotificationContext.jsx';
import { formatTime } from '../utils/format.js';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  return (
    <nav className={`navbar ${mobileOpen ? 'open' : ''}`}>
      <div className="navbar-inner">
        <Link to="/" className="brand" onClick={() => setMobileOpen(false)}>
          <span className="brand-mark">🖨</span>
          CampusPrint
        </Link>

        <div className="nav-links">
          {!user && (
            <>
              <NavLink to="/login" onClick={() => setMobileOpen(false)}>Log in</NavLink>
              <NavLink to="/signup" onClick={() => setMobileOpen(false)}>Sign up</NavLink>
            </>
          )}
          {user && user.role === 'student' && (
            <>
              <NavLink to="/" end onClick={() => setMobileOpen(false)}>Dashboard</NavLink>
              <NavLink to="/new-order" onClick={() => setMobileOpen(false)}>New Order</NavLink>
              <NavLink to="/my-orders" onClick={() => setMobileOpen(false)}>My Orders</NavLink>
            </>
          )}
          {user && user.role === 'staff' && (
            <NavLink to="/staff" end onClick={() => setMobileOpen(false)}>Shop Queue</NavLink>
          )}
        </div>

        <div className="nav-right">
          {user && <NotificationBell panelOpen={panelOpen} setPanelOpen={setPanelOpen} />}
          {user && (
            <>
              <span className="role-pill">{user.role}</span>
              <span className="avatar" title={user.name}>
                {user.name.slice(0, 1).toUpperCase()}
              </span>
              <button
                className="btn btn-ghost"
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
              >
                Log out
              </button>
            </>
          )}
          <button className="nav-toggle" onClick={() => setMobileOpen((o) => !o)} aria-label="Toggle menu">
            ☰
          </button>
        </div>
      </div>
    </nav>
  );
}

function NotificationBell({ panelOpen, setPanelOpen }) {
  const { notifications, unread, markAllRead } = useNotifications();

  return (
    <div style={{ position: 'relative' }}>
      <button
        className="bell-btn"
        onClick={() => {
          setPanelOpen((o) => !o);
          if (!panelOpen) markAllRead();
        }}
        aria-label="Notifications"
      >
        🔔
        {unread > 0 && <span className="bell-dot" />}
      </button>
      {panelOpen && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 50 }} onClick={() => setPanelOpen(false)} />
          <div className="notif-panel">
            <div className="notif-panel-header">Notifications</div>
            {notifications.length === 0 ? (
              <div className="notif-empty">No notifications yet.</div>
            ) : (
              notifications.map((n) => (
                <div key={n.id} className="notif-item">
                  <div>{n.text}</div>
                  <div className="muted" style={{ fontSize: '0.72rem', marginTop: 2 }}>{formatTime(n.at)}</div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
