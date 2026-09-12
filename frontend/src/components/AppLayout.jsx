import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { PixelLogo, PixelStatusDot } from './PixelArt.jsx';
import { 
  LayoutDashboard, 
  PlusCircle, 
  FileText, 
  Layers, 
  LogOut, 
  Bell, 
  BarChart3,
  ChevronRight
} from 'lucide-react';

export function RetroFooter() {
  return (
    <footer
      style={{
        backgroundColor: '#000814',
        borderTop: '2px solid #000000',
        padding: '16px 28px',
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        fontFamily: 'var(--font-heading)',
        fontSize: '0.82rem',
        fontWeight: 700,
        letterSpacing: '0.02em',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <PixelLogo size={22} color="#FFC300" />
        <span style={{ color: '#FFC300', fontWeight: 900, letterSpacing: '0.04em' }}>CAMPUSPRINT</span>
        <span style={{ color: '#003566' }}>|</span>
        <span style={{ color: '#94A3B8', fontWeight: 600 }}>
          Digital Xerox &amp; Stationery Ordering System
        </span>
      </div>
      <div style={{ color: '#FFD60A', fontWeight: 800, letterSpacing: '0.06em' }}>
        FAST · SIMPLE · CAMPUS READY
      </div>
    </footer>
  );
}

export function AppLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const isStaff = user?.role === 'staff';

  function handleLogout() {
    logout();
    navigate('/login');
  }

  // If unauthenticated or on login/signup page, don't show sidebar
  if (!user || isAuthPage) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F8F5ED' }}>
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

  const getPageTitle = () => {
    const p = location.pathname;
    if (p.includes('/dashboard')) return 'DASHBOARD';
    if (p.includes('/new-order') || p === '/order') return 'NEW PRINT ORDER';
    if (p.includes('/orders') || p.includes('/my-orders')) return 'MY ORDERS';
    if (p.includes('/staff')) return 'SHOP QUEUE & ORDERS';
    if (p.includes('/success') || p.includes('/order-placed')) return 'ORDER RECEIPT';
    if (p.startsWith('/order/')) return 'ORDER HARDWARE TRACKER';
    return 'CAMPUSPRINT';
  };

  const navItems = !isStaff
    ? [
        { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/new-order', label: 'New Order', icon: PlusCircle },
        { to: '/orders', label: 'My Orders', icon: FileText },
      ]
    : [
        { to: '/staff', label: 'Queue', icon: Layers },
        { to: '/staff', label: 'Orders', icon: FileText },
        { to: '/staff', label: 'Statistics', icon: BarChart3 },
      ];

  const isItemActive = (to, label) => {
    if (label === 'Dashboard' && (location.pathname === '/dashboard' || location.pathname === '/')) return true;
    if (label === 'New Order' && (location.pathname === '/order' || location.pathname === '/new-order')) return true;
    if (label === 'My Orders' && (location.pathname === '/orders' || location.pathname === '/my-orders')) return true;
    if (label === 'Queue' && location.pathname === '/staff') return true;
    return false;
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F8F5ED' }}>
      <div style={{ display: 'flex', flex: 1, minHeight: 'calc(100vh - 56px)' }}>
        {/* Left Sidebar (Desktop: 240px wide, crisp 2px black right border) */}
        <aside
          style={{
            width: '240px',
            backgroundColor: '#F8F5ED',
            borderRight: '2px solid #000000',
            padding: '24px 16px',
            position: 'sticky',
            top: 0,
            height: '100vh',
            flexShrink: 0,
            zIndex: 30,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            {/* Logo Block: yellow printer icon + bold black text */}
            <Link
              to={isStaff ? '/staff' : '/dashboard'}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                fontFamily: 'var(--font-heading)',
                fontWeight: 900,
                fontSize: '1.25rem',
                letterSpacing: '-0.02em',
                color: '#000000',
                textDecoration: 'none',
                padding: '6px 8px',
                marginBottom: '28px',
              }}
            >
              <PixelLogo size={28} color="#FFC300" />
              <span>CAMPUSPRINT</span>
            </Link>

            {/* Menu Items: rounded pill buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {navItems.map((item, idx) => {
                const active = isItemActive(item.to, item.label);
                const IconComponent = item.icon;
                return (
                  <Link
                    key={idx}
                    to={item.to}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: '2px solid #000000',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 900,
                      fontSize: '0.88rem',
                      textDecoration: 'none',
                      color: active ? '#000000' : '#001D3D',
                      backgroundColor: active ? '#FFC300' : '#FFFFFF',
                      boxShadow: active ? '3px 3px 0px 0px #000000' : '2px 2px 0px 0px #000000',
                      transition: 'all 0.1s ease',
                    }}
                  >
                    <IconComponent size={18} color={active ? '#000000' : '#003566'} strokeWidth={active ? 2.5 : 2} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* User Profile Badge at Bottom: rounded-full border-2 border-black */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px',
              backgroundColor: '#FFFFFF',
              border: '2px solid #000000',
              borderRadius: '16px',
              boxShadow: '3px 3px 0px 0px #000000',
              marginTop: 'auto',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '9999px',
                  border: '2px solid #000000',
                  backgroundColor: isStaff ? '#003566' : '#BAE6FD',
                  color: isStaff ? '#FFFFFF' : '#000000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 900,
                  fontSize: '0.85rem',
                }}
              >
                {initials}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#000000' }}>
                  {user.name || user.email?.split('@')[0]}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <PixelStatusDot color="#86EFAC" size={6} />
                  <span
                    style={{
                      fontSize: '0.7rem',
                      color: '#4B5563',
                      textTransform: 'capitalize',
                      fontWeight: 700,
                    }}
                  >
                    {user.role}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              title="Log Out"
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#000000',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                borderRadius: '6px',
              }}
            >
              <LogOut size={16} />
            </button>
          </div>
        </aside>

        {/* Main Content Area (Desktop) */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {/* Top Utility Strip */}
          <header
            style={{
              height: '64px',
              backgroundColor: '#F8F5ED',
              borderBottom: '2px solid #000000',
              padding: '0 28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'sticky',
              top: 0,
              zIndex: 20,
            }}
          >
            {/* Left: Breadcrumb / Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.75rem', fontWeight: 900, color: '#003566', letterSpacing: '0.04em' }}>
                CAMPUSPRINT
              </span>
              <ChevronRight size={14} style={{ color: '#000000' }} strokeWidth={2.5} />
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.9rem',
                  fontWeight: 900,
                  color: '#000000',
                  letterSpacing: '0.02em',
                }}
              >
                {getPageTitle()}
              </span>
            </div>

            {/* Right: Quick Notification Bell + User Profile Chip */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Notification Bell Button */}
              <button
                type="button"
                aria-label="Notifications"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  border: '2px solid #000000',
                  backgroundColor: '#FFFFFF',
                  boxShadow: '2px 2px 0px 0px #000000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                }}
              >
                <Bell size={18} color="#000000" />
                <span
                  style={{
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#EF4444',
                    border: '1.5px solid #000000',
                  }}
                />
              </button>

              {/* User Profile Chip */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#FFFFFF',
                  border: '2px solid #000000',
                  borderRadius: '9999px',
                  padding: '4px 12px 4px 6px',
                  boxShadow: '2px 2px 0px 0px #000000',
                  fontSize: '0.75rem',
                  fontWeight: 900,
                  fontFamily: 'var(--font-heading)',
                }}
              >
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '9999px',
                    border: '1.5px solid #000000',
                    backgroundColor: isStaff ? '#003566' : '#BAE6FD',
                    color: isStaff ? '#FFFFFF' : '#000000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.7rem',
                    fontWeight: 900,
                  }}
                >
                  {initials}
                </div>
                <span>{user.name ? user.name.split(' ')[0] : 'User'}</span>
              </div>
            </div>
          </header>

          {/* Route Content Container */}
          <main style={{ flex: 1, padding: '32px 36px', maxWidth: '1440px', width: '100%', margin: '0 auto' }}>
            {children}
          </main>
        </div>
      </div>

      {/* Retro Navy Footer */}
      <RetroFooter />
    </div>
  );
}

export default AppLayout;
