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
  BarChart3,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';

export function RetroFooter() {
  return (
    <footer
      style={{
        backgroundColor: '#000814',
        borderTop: '2px solid #000000',
        padding: '16px 24px',
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        fontFamily: 'var(--font-heading)',
        fontSize: '0.8rem',
        fontWeight: 700,
        letterSpacing: '0.02em',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <PixelLogo size={20} color="#FFC300" />
        <span style={{ color: '#FFC300', fontWeight: 900 }}>CAMPUSPRINT</span>
        <span style={{ color: '#4B5563' }}>|</span>
        <span style={{ color: '#94A3B8', fontWeight: 600 }}>
          Digital Xerox & Stationery Ordering System
        </span>
      </div>
      <div style={{ color: '#FFD60A', fontWeight: 800, letterSpacing: '0.05em' }}>
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
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#FBF8F1' }}>
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

  // Compute breadcrumb / page title
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#FBF8F1' }}>
      <div style={{ display: 'flex', flex: 1, minHeight: 'calc(100vh - 56px)' }}>
        {/* Left Sidebar (Desktop) */}
        <aside
          style={{
            width: '240px',
            backgroundColor: '#FBF8F1',
            borderRight: '2px solid #000000',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '24px 16px',
            position: 'sticky',
            top: 0,
            height: '100vh',
            flexShrink: 0,
            zIndex: 30,
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
                fontSize: '1.2rem',
                letterSpacing: '-0.02em',
                color: '#000000',
                textDecoration: 'none',
                padding: '6px 8px',
                marginBottom: '28px',
              }}
            >
              <PixelLogo size={26} color="#FFC300" />
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
                      borderRadius: '12px', // rounded-xl
                      border: '2px solid #000000',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 900,
                      fontSize: '0.875rem',
                      textDecoration: 'none',
                      color: '#000000',
                      backgroundColor: active ? '#FFC300' : 'transparent',
                      boxShadow: active ? '2px 2px 0px 0px #000000' : 'none',
                      transition: 'all 0.12s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.backgroundColor = '#F7F4EB';
                        e.currentTarget.style.boxShadow = '2px 2px 0px 0px #000000';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.boxShadow = 'none';
                      }
                    }}
                  >
                    <IconComponent size={18} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* User Profile Badge at Bottom: rounded-full border-2 border-black bg-[#BAE6FD] */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
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
                  width: '36px',
                  height: '36px',
                  borderRadius: '9999px', // rounded-full
                  border: '2px solid #000000',
                  backgroundColor: '#BAE6FD',
                  color: '#000000',
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
                transition: 'transform 0.1s ease',
              }}
            >
              <LogOut size={16} />
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {/* Top Utility Strip */}
          <header
            style={{
              height: '64px',
              backgroundColor: '#FBF8F1',
              borderBottom: '2px solid #000000',
              padding: '0 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'sticky',
              top: 0,
              zIndex: 20,
            }}
          >
            {/* Breadcrumb / Page Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.75rem', fontWeight: 800, color: '#6B7280' }}>
                CAMPUSPRINT
              </span>
              <ChevronRight size={14} style={{ color: '#9CA3AF' }} />
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
                  transition: 'transform 0.1s ease',
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
                    borderRadius: '50%',
                    backgroundColor: '#EF4444',
                    border: '1.5px solid #000000',
                  }}
                />
              </button>

              {/* User Profile Chip: rounded-full border-2 border-black px-3 py-1.5 bg-white text-xs font-bold */}
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
                    backgroundColor: '#BAE6FD',
                    color: '#000000',
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
          <main style={{ flex: 1, padding: '32px 28px', maxWidth: '1440px', width: '100%', margin: '0 auto' }}>
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
