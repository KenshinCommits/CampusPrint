import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { PixelLogo } from './PixelArt.jsx';
import { 
  LayoutDashboard, 
  PlusCircle, 
  FileText, 
  Layers, 
  Clock, 
  LogOut, 
  Bell, 
  Menu, 
  X,
  Printer,
  BarChart3
} from 'lucide-react';
import { useState } from 'react';

export function RetroFooter() {
  return (
    <footer className="retro-footer">
      <div className="footer-left">
        <PixelLogo size={18} color="#FFD028" />
        <span>CAMPUSPRINT</span>
        <span style={{ color: '#64748B' }}>|</span>
        <span style={{ color: '#CBD5E1', fontWeight: 500 }}>
          Digital Xerox & Stationery Ordering System
        </span>
      </div>
      <div className="footer-right">
        FAST · SIMPLE · CAMPUS READY
      </div>
    </footer>
  );
}

export function AppLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const isStaff = user?.role === 'staff';

  function handleLogout() {
    logout();
    navigate('/login');
  }

  // If unauthenticated or on login/signup page, don't show sidebar
  if (!user || isAuthPage) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-cream)' }}>
        <main style={{ flex: 1 }}>{children}</main>
        <RetroFooter />
      </div>
    );
  }

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'U';

  return (
    <div className="app-shell">
      <div className="app-body">
        {/* Left Sidebar (Desktop) */}
        <aside className="app-sidebar">
          <div>
            <Link to={isStaff ? '/staff' : '/dashboard'} className="sidebar-logo">
              <PixelLogo size={24} color="#000" />
              <span>CAMPUSPRINT</span>
            </Link>

            <div className="sidebar-menu">
              {!isStaff ? (
                <>
                  <Link
                    to="/dashboard"
                    className={`sidebar-link ${location.pathname === '/dashboard' || location.pathname === '/' ? 'active' : ''}`}
                  >
                    <LayoutDashboard size={18} />
                    <span>Dashboard</span>
                  </Link>

                  <Link
                    to="/order"
                    className={`sidebar-link ${location.pathname === '/order' || location.pathname === '/new-order' ? 'active' : ''}`}
                  >
                    <PlusCircle size={18} />
                    <span>New Order</span>
                  </Link>

                  <Link
                    to="/orders"
                    className={`sidebar-link ${location.pathname === '/orders' || location.pathname === '/my-orders' ? 'active' : ''}`}
                  >
                    <FileText size={18} />
                    <span>My Orders</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/staff"
                    className={`sidebar-link ${location.pathname === '/staff' ? 'active' : ''}`}
                  >
                    <Layers size={18} />
                    <span>Queue</span>
                  </Link>

                  <Link
                    to="/staff"
                    className="sidebar-link"
                  >
                    <FileText size={18} />
                    <span>Orders</span>
                  </Link>

                  <Link
                    to="/staff"
                    className="sidebar-link"
                  >
                    <BarChart3 size={18} />
                    <span>Statistics</span>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* User Profile Card at Bottom of Sidebar */}
          <div className="sidebar-user-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  border: '2px solid #000',
                  background: isStaff ? '#0D9488' : '#2563EB',
                  color: '#FFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                }}
              >
                {initials}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#000' }}>
                  {user.name || user.email}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'capitalize', fontWeight: 600 }}>
                  {user.role}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Log Out"
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#6B7280',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <LogOut size={16} />
            </button>
          </div>
        </aside>

        {/* Main Content Area with Top Utility Bar */}
        <div className="app-main">
          <header className="top-utility-bar">
            {/* Mobile Brand Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: 'auto' }}>
              <Link to={isStaff ? '/staff' : '/dashboard'} style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: '#000' }}>
                <PixelLogo size={20} color="#000" />
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1rem' }}>
                  CAMPUSPRINT
                </span>
              </Link>
            </div>

            {/* Notification Bell */}
            <button
              type="button"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                border: '2px solid #000',
                background: '#FFF',
                boxShadow: '2px 2px 0px #000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                position: 'relative',
              }}
            >
              <Bell size={16} />
              <span
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#EF4444',
                  border: '1px solid #000',
                }}
              />
            </button>

            {/* Top User Pill */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#FFF',
                border: '2px solid #000',
                borderRadius: '999px',
                padding: '4px 10px 4px 5px',
                boxShadow: '2px 2px 0px #000',
              }}
            >
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  border: '1.5px solid #000',
                  background: isStaff ? '#0D9488' : '#2563EB',
                  color: '#FFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-heading)',
                }}
              >
                {initials}
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
                {user.name ? user.name.split(' ')[0] : 'User'}
              </span>
            </div>
          </header>

          <main className="content-container">{children}</main>
        </div>
      </div>

      {/* Retro Navy Footer */}
      <RetroFooter />
    </div>
  );
}
