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
        borderTop: '2px solid #000814',
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
        {/* Left Sidebar (Desktop: 240px wide, Golden Twilight Dark Navy #001D3D) */}
        <aside
          style={{
            width: '240px',
            backgroundColor: '#001D3D',
            borderRight: '2px solid #000814',
            padding: '24px 16px',
            position: 'sticky',
            top: 0,
            height: '100vh',
            flexShrink: 0,
            zIndex: 30,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            color: '#FFFFFF',
          }}
        >
          <div>
            {/* Branding Header: yellow pixel printer icon + bold uppercase white text */}
            <Link
              to={isStaff ? '/staff' : '/dashboard'}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                fontFamily: 'var(--font-heading)',
                fontWeight: 900,
                fontSize: '1.25rem',
                letterSpacing: '0.04em',
                color: '#FFFFFF',
                textDecoration: 'none',
                padding: '6px 8px',
                marginBottom: '28px',
              }}
            >
              <PixelLogo size={28} color="#FFD60A" />
              <span>CAMPUSPRINT</span>
              <span style={{ color: '#FFD60A', fontSize: '1.4rem', lineHeight: 0 }}>.</span>
            </Link>

            {/* Menu Navigation Links */}
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
                      border: active ? '2px solid #000814' : '2px solid transparent',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: active ? 900 : 700,
                      fontSize: '0.9rem',
                      textDecoration: 'none',
                      color: active ? '#000814' : '#FFFFFF',
                      backgroundColor: active ? '#FFD60A' : 'transparent',
                      boxShadow: active ? '3px 3px 0px 0px #000814' : 'none',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.backgroundColor = '#003566';
                        e.currentTarget.style.color = '#FFD60A';
                        e.currentTarget.style.borderColor = '#000814';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#FFFFFF';
                        e.currentTarget.style.borderColor = 'transparent';
                      }
                    }}
                  >
                    <IconComponent
                      size={18}
                      color={active ? '#000814' : '#FFFFFF'}
                      strokeWidth={active ? 2.5 : 2}
                    />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Bottom User Capsule: bg-[#000814] border-2 border-[#003566] p-3 rounded-2xl */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px',
              backgroundColor: '#000814',
              border: '2px solid #003566',
              borderRadius: '16px',
              boxShadow: '3px 3px 0px 0px #000814',
              marginTop: 'auto',
              color: '#FFFFFF',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '9999px',
                  border: '2px solid #000814',
                  backgroundColor: '#FFC300',
                  color: '#000814',
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
                <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#FFFFFF' }}>
                  {user.name || user.email?.split('@')[0]}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <PixelStatusDot color="#86EFAC" size={6} />
                  <span
                    style={{
                      fontSize: '0.7rem',
                      color: '#94A3B8',
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
                color: '#FFD60A',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                borderRadius: '6px',
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#FFFFFF'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#FFD60A'; }}
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
              backgroundColor: '#FBF8F1',
              borderBottom: '2px solid #000814',
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
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.75rem', fontWeight: 900, color: '#001D3D', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                CAMPUSPRINT
              </span>
              <ChevronRight size={14} style={{ color: '#000814' }} strokeWidth={2.5} />
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.9rem',
                  fontWeight: 900,
                  color: '#000814',
                  letterSpacing: '0.02em',
                }}
              >
                {getPageTitle()}
              </span>
            </div>

            {/* Right: Quick Notification Bell + User Profile Chip */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Notification Bell Button: rounded-full */}
              <button
                type="button"
                aria-label="Notifications"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '9999px',
                  border: '2px solid #000814',
                  backgroundColor: '#FFFFFF',
                  boxShadow: '2px 2px 0px 0px #000814',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                }}
              >
                <Bell size={18} color="#000814" />
                <span
                  style={{
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#EF4444',
                    border: '1.5px solid #000814',
                    borderRadius: '50%',
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
                  border: '2px solid #000814',
                  borderRadius: '9999px',
                  padding: '4px 12px 4px 6px',
                  boxShadow: '2px 2px 0px 0px #000814',
                  fontSize: '0.75rem',
                  fontWeight: 900,
                  fontFamily: 'var(--font-heading)',
                  color: '#000814',
                }}
              >
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '9999px',
                    backgroundColor: '#FFC300',
                    border: '1.5px solid #000814',
                    color: '#000814',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.65rem',
                    fontWeight: 900,
                  }}
                >
                  {initials}
                </div>
                <span>{user.name?.split(' ')[0] || 'User'}</span>
              </div>
            </div>
          </header>

          {/* Page Content Container */}
          <main
            style={{
              flex: 1,
              padding: 'clamp(20px, 3.5vw, 36px) clamp(20px, 4vw, 40px)',
              maxWidth: '1440px',
              width: '100%',
              margin: '0 auto',
            }}
          >
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
