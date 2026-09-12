import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotifications } from '../context/NotificationContext.jsx';
import { 
  PixelGraduationCap, 
  PixelStudentAvatar,
  PixelLogo 
} from './PixelArt.jsx';
import { PixelCampusBuilding, PixelArt } from './pixel/index.js';
import { 
  LayoutDashboard, 
  PlusCircle, 
  FileText, 
  Layers, 
  LogOut, 
  Bell, 
  ChevronDown,
  ArrowRightLeft,
  User,
  Plus,
  X
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
        <PixelLogo size={20} color="#FFC300" />
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

function formatRelativeTime(dateStr) {
  if (!dateStr) return '';
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return new Date(dateStr).toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export function AppLayout({ children }) {
  const { user, login, logout } = useAuth();
  const { notifications, unread, markAllRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const notifRef = useRef(null);
  const userMenuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setShowNotifications(false);
    setShowUserMenu(false);
  }, [location.pathname]);

  async function handleSwitchRole() {
    try {
      if (user?.role === 'student') {
        await login('staff@campusprint.demo', 'staff123');
        navigate('/staff');
      } else {
        await login('student@campusprint.demo', 'student123');
        navigate('/dashboard');
      }
      setShowUserMenu(false);
    } catch (err) {
      console.error('Failed to switch role', err);
    }
  }

  const isLandingPage = location.pathname === '/';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/register';
  const isStaff = user?.role === 'staff';

  function handleLogout() {
    logout();
    navigate('/login');
  }

  // Root landing page renders full-screen standalone layout
  if (isLandingPage) {
    return <main style={{ minHeight: '100vh' }}>{children}</main>;
  }

  // If unauthenticated or on login/signup page, don't show full dashboard layout
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
    : 'DS';

  const isDashboardActive = location.pathname === '/dashboard' || location.pathname === '/';
  const isNewOrderActive = location.pathname === '/order' || location.pathname === '/new-order';
  const isMyOrdersActive = location.pathname === '/orders' || location.pathname === '/my-orders';
  const isStaffActive = location.pathname === '/staff';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F4F6FA' }}>
      {/* 1. FULL-WIDTH TOP HEADER BAR (Deep Navy #001D3D) matching Reference Mockup */}
      <header
        style={{
          height: '68px',
          backgroundColor: '#001D3D',
          borderBottom: '2px solid #000814',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}
      >
        {/* Left: Pixel Graduation Cap + CAMPUSPRINT Branding */}
        <Link
          to={isStaff ? '/staff' : '/dashboard'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textDecoration: 'none',
          }}
        >
          <PixelGraduationCap size={36} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: '1rem',
                letterSpacing: '0.04em',
                color: '#FFFFFF',
                lineHeight: 1.2,
              }}
            >
              CAMPUS<span style={{ color: '#FFD60A' }}>PRINT</span>
            </span>
            <span
              style={{
                fontFamily: "'Silkscreen', monospace",
                fontWeight: 700,
                fontSize: '0.62rem',
                letterSpacing: '0.12em',
                color: '#FFD60A',
                textTransform: 'uppercase',
                marginTop: '2px',
              }}
            >
              PRINT. PAY. PICK UP.
            </span>
          </div>
        </Link>

        {/* Right Action Icons: Notifications, and User Profile (Duplicate top-bar nav links removed) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Notifications Button with Square Badge */}
          <div ref={notifRef} style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => {
                setShowNotifications((prev) => {
                  if (!prev) markAllRead();
                  return !prev;
                });
                setShowUserMenu(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'transparent',
                border: 'none',
                color: '#E2E8F0',
                fontFamily: "'Silkscreen', monospace",
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                padding: '6px 10px',
                borderRadius: 0,
                position: 'relative',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#FFD60A'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#E2E8F0'; }}
            >
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Bell size={18} color="#FFD60A" />
                <span
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-8px',
                    minWidth: '15px',
                    height: '15px',
                    padding: '0 3px',
                    backgroundColor: '#EF4444',
                    border: '1.5px solid #000814',
                    borderRadius: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.62rem',
                    color: '#FFFFFF',
                    fontFamily: 'monospace',
                    fontWeight: 900,
                  }}
                >
                  {unread > 0 ? unread : 4}
                </span>
              </div>
              <span style={{ color: '#FFFFFF' }}>Notifications</span>
            </button>

            {/* Notifications Dropdown Popover */}
            {showNotifications && (
              <div
                style={{
                  position: 'absolute',
                  top: '44px',
                  right: 0,
                  width: '320px',
                  maxHeight: '400px',
                  backgroundColor: '#FFFFFF',
                  border: '3px solid #000814',
                  borderRadius: 0,
                  boxShadow: '4px 4px 0px 0px #000814',
                  zIndex: 100,
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    padding: '12px 14px',
                    backgroundColor: '#001D3D',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '2px solid #000814',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Bell size={16} color="#FFD60A" />
                    <span style={{ fontFamily: "'Silkscreen', monospace", fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.04em' }}>
                      NOTIFICATIONS
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      backgroundColor: '#003566',
                      color: '#FFD60A',
                      padding: '2px 8px',
                      borderRadius: 0,
                      border: '1px solid #000814',
                      fontFamily: "'Silkscreen', monospace",
                      fontWeight: 700,
                    }}
                  >
                    {notifications.length} total
                  </span>
                </div>

                <div style={{ overflowY: 'auto', maxHeight: '300px', padding: '8px' }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding: '24px 16px', textAlign: 'center', color: '#6B7280' }}>
                      <div style={{ fontSize: '1.4rem', marginBottom: '6px' }}>🔔</div>
                      <p style={{ fontFamily: "'Silkscreen', monospace", fontWeight: 700, fontSize: '0.82rem', color: '#000814' }}>
                        All caught up!
                      </p>
                      <p style={{ fontSize: '0.75rem', fontFamily: 'monospace', marginTop: '2px' }}>
                        Order updates &amp; hardware statuses will appear here.
                      </p>
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        style={{
                          padding: '10px 12px',
                          borderRadius: 0,
                          border: '2px solid #000814',
                          backgroundColor: '#FBF8F1',
                          marginBottom: '6px',
                          fontSize: '0.8rem',
                          color: '#000814',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px',
                        }}
                      >
                        <span style={{ fontFamily: 'monospace', fontWeight: 600, lineHeight: 1.4 }}>{n.text}</span>
                        <span style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: '#6B7280', alignSelf: 'flex-end' }}>
                          {formatRelativeTime(n.at)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Chip Button */}
          <div ref={userMenuRef} style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => {
                setShowUserMenu((prev) => !prev);
                setShowNotifications(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#001D3D',
                border: '2px solid #000814',
                borderRadius: 0,
                boxShadow: '2px 2px 0px 0px #000814',
                padding: '4px 12px 4px 6px',
                color: '#FFFFFF',
                fontFamily: "'Silkscreen', monospace",
                fontWeight: 700,
                fontSize: '0.78rem',
                cursor: 'pointer',
                transition: 'none',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#FFD60A'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#000814'; }}
            >
              {/* Square Pixel Avatar */}
              <div style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, borderRadius: 0, overflow: 'hidden' }}>
                <PixelStudentAvatar size={28} />
              </div>
              <span>{user.name || 'Demo Student'}</span>
              <ChevronDown
                size={14}
                color="#FFD60A"
                strokeWidth={2.5}
                style={{
                  transform: showUserMenu ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.15s ease',
                }}
              />
            </button>

            {/* User Dropdown Menu Popover */}
            {showUserMenu && (
              <div
                style={{
                  position: 'absolute',
                  top: '44px',
                  right: 0,
                  width: '260px',
                  backgroundColor: '#FFFFFF',
                  border: '3px solid #000814',
                  borderRadius: 0,
                  boxShadow: '4px 4px 0px 0px #000814',
                  zIndex: 100,
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    padding: '14px',
                    backgroundColor: '#FBF8F1',
                    borderBottom: '2px solid #000814',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: 0,
                      backgroundColor: '#FFC300',
                      border: '2px solid #000814',
                      color: '#000814',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: '0.75rem',
                      flexShrink: 0,
                    }}
                  >
                    {initials}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <span style={{ fontFamily: "'Silkscreen', monospace", fontWeight: 700, fontSize: '0.8rem', color: '#000814', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                      {user.name || 'Demo Student'}
                    </span>
                    <span style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: '#6B7280', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                      {user.email}
                    </span>
                    <span
                      style={{
                        alignSelf: 'flex-start',
                        marginTop: '4px',
                        fontSize: '0.62rem',
                        fontFamily: "'Silkscreen', monospace",
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        backgroundColor: '#003566',
                        color: '#FFD60A',
                        padding: '2px 6px',
                        borderRadius: 0,
                        border: '1px solid #000814',
                      }}
                    >
                      {user.role}
                    </span>
                  </div>
                </div>

                <div style={{ padding: '6px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileModal(true);
                      setShowUserMenu(false);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 10px',
                      borderRadius: 0,
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: '#000814',
                      cursor: 'pointer',
                      fontFamily: "'Silkscreen', monospace",
                      fontWeight: 700,
                      fontSize: '0.76rem',
                      textAlign: 'left',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FEF08A'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    <User size={15} />
                    <span>View Profile</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSwitchRole}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 10px',
                      borderRadius: 0,
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: '#003566',
                      cursor: 'pointer',
                      fontFamily: "'Silkscreen', monospace",
                      fontWeight: 700,
                      fontSize: '0.76rem',
                      textAlign: 'left',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#BAE6FD'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    <ArrowRightLeft size={15} />
                    <span>Switch to {isStaff ? 'Student' : 'Staff'}</span>
                  </button>

                  <div style={{ height: '2px', backgroundColor: '#000814', margin: '4px 0' }} />

                  <button
                    type="button"
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 10px',
                      borderRadius: 0,
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: '#DC2626',
                      cursor: 'pointer',
                      fontFamily: "'Silkscreen', monospace",
                      fontWeight: 700,
                      fontSize: '0.76rem',
                      textAlign: 'left',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FECACA'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    <LogOut size={15} />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. BODY CONTAINER: LEFT SIDEBAR + MAIN CONTENT AREA */}
      <div style={{ display: 'flex', flex: 1, minHeight: 'calc(100vh - 68px)' }}>
        {/* Left Sidebar (Dark Navy #001D3D, 220px wide) */}
        <aside
          style={{
            width: '220px',
            backgroundColor: '#001D3D',
            borderRight: '2px solid #000814',
            padding: '24px 14px 16px',
            position: 'sticky',
            top: '68px',
            height: 'calc(100vh - 68px)',
            flexShrink: 0,
            zIndex: 20,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            color: '#FFFFFF',
            overflowY: 'auto',
          }}
        >
          {/* Top Menu Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Dashboard Link - Active as Bright Yellow Beveled Tile */}
            <Link
              to={isStaff ? '/staff' : '/dashboard'}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: 0,
                fontFamily: "'Silkscreen', monospace",
                fontWeight: 700,
                fontSize: '0.8rem',
                textDecoration: 'none',
                color: isDashboardActive || (isStaff && isStaffActive) ? '#000814' : '#E2E8F0',
                backgroundColor: isDashboardActive || (isStaff && isStaffActive) ? '#FFD60A' : 'transparent',
                border: isDashboardActive || (isStaff && isStaffActive) ? '2px solid #000814' : '2px solid transparent',
                boxShadow: isDashboardActive || (isStaff && isStaffActive) ? '2px 2px 0px #000814' : 'none',
                transition: 'none',
              }}
              onMouseEnter={(e) => {
                if (!isDashboardActive) {
                  e.currentTarget.style.backgroundColor = '#003566';
                  e.currentTarget.style.color = '#FFD60A';
                }
              }}
              onMouseLeave={(e) => {
                if (!isDashboardActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#E2E8F0';
                }
              }}
            >
              <LayoutDashboard size={18} color={isDashboardActive ? '#000814' : '#FFFFFF'} strokeWidth={2.5} />
              <span>Dashboard</span>
            </Link>

            {/* + New Order */}
            {!isStaff && (
              <Link
                to="/new-order"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: 0,
                  fontFamily: "'Silkscreen', monospace",
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  textDecoration: 'none',
                  color: isNewOrderActive ? '#000814' : '#E2E8F0',
                  backgroundColor: isNewOrderActive ? '#FFD60A' : 'transparent',
                  border: isNewOrderActive ? '2px solid #000814' : '2px solid transparent',
                  boxShadow: isNewOrderActive ? '2px 2px 0px #000814' : 'none',
                  transition: 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isNewOrderActive) {
                    e.currentTarget.style.backgroundColor = '#003566';
                    e.currentTarget.style.color = '#FFD60A';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isNewOrderActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#E2E8F0';
                  }
                }}
              >
                <Plus size={18} strokeWidth={2.5} />
                <span>New Order</span>
              </Link>
            )}

            {/* My Orders */}
            {!isStaff && (
              <Link
                to="/orders"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: 0,
                  fontFamily: "'Silkscreen', monospace",
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  textDecoration: 'none',
                  color: isMyOrdersActive ? '#000814' : '#E2E8F0',
                  backgroundColor: isMyOrdersActive ? '#FFD60A' : 'transparent',
                  border: isMyOrdersActive ? '2px solid #000814' : '2px solid transparent',
                  boxShadow: isMyOrdersActive ? '2px 2px 0px #000814' : 'none',
                  transition: 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isMyOrdersActive) {
                    e.currentTarget.style.backgroundColor = '#003566';
                    e.currentTarget.style.color = '#FFD60A';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isMyOrdersActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#E2E8F0';
                  }
                }}
              >
                <FileText size={18} strokeWidth={2.5} />
                <span>My Orders</span>
              </Link>
            )}

            {/* Notifications */}
            <button
              type="button"
              onClick={() => {
                setShowNotifications((prev) => {
                  if (!prev) markAllRead();
                  return !prev;
                });
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: 0,
                fontFamily: "'Silkscreen', monospace",
                fontWeight: 700,
                fontSize: '0.8rem',
                border: 'none',
                backgroundColor: 'transparent',
                color: '#E2E8F0',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#003566';
                e.currentTarget.style.color = '#FFD60A';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#E2E8F0';
              }}
            >
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Bell size={18} strokeWidth={2.5} />
                {unread > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      width: '8px',
                      height: '8px',
                      backgroundColor: '#EF4444',
                      borderRadius: 0,
                      border: '1.5px solid #000814',
                    }}
                  />
                )}
              </div>
              <span>Notifications</span>
            </button>

            {/* Profile */}
            <button
              type="button"
              onClick={() => setShowProfileModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: 0,
                fontFamily: "'Silkscreen', monospace",
                fontWeight: 700,
                fontSize: '0.8rem',
                border: 'none',
                backgroundColor: 'transparent',
                color: '#E2E8F0',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#003566';
                e.currentTarget.style.color = '#FFD60A';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#E2E8F0';
              }}
            >
              <User size={18} strokeWidth={2.5} />
              <span>Profile</span>
            </button>
          </div>

          {/* Bottom of Sidebar: Pixel Campus Building + Slogan matching Reference Mockup */}
          <div style={{ marginTop: 'auto', paddingTop: '16px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div
              style={{
                width: '100%',
                overflow: 'hidden',
                borderRadius: 0,
                border: '2px solid #000814',
                marginBottom: '14px',
                boxShadow: '2px 2px 0px #000814',
                imageRendering: 'pixelated',
              }}
            >
              <PixelCampusBuilding width={192} height={140} />
            </div>

            <div
              style={{
                fontFamily: "'Silkscreen', monospace",
                fontSize: '0.74rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                lineHeight: 1.3,
                color: '#E2E8F0',
                marginBottom: '6px',
              }}
            >
              SAME CAMPUS.<br />
              BRIGHTER IDEAS.
            </div>
            {/* Small yellow accent underline */}
            <div
              style={{
                width: '28px',
                height: '3.5px',
                backgroundColor: '#FFD60A',
                borderRadius: 0,
              }}
            />
          </div>
        </aside>

        {/* Right Main Content Area (Background #F4F6FA) */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <main
            style={{
              flex: 1,
              padding: '24px 28px',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            {children}
          </main>
        </div>
      </div>

      {/* Retro Navy Footer */}
      <RetroFooter />

      {/* Profile Modal */}
      {showProfileModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 8, 20, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '16px',
          }}
          onClick={() => setShowProfileModal(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '4px solid #000814',
              borderRadius: 0,
              boxShadow: '6px 6px 0px 0px #000814',
              width: '100%',
              maxWidth: '420px',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                backgroundColor: '#001D3D',
                color: '#FFFFFF',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '3px solid #000814',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={18} color="#FFD60A" />
                <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '0.8rem', letterSpacing: '0.04em' }}>
                  STUDENT PROFILE
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowProfileModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Profile Body */}
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <PixelArt name="studentCard" size={90} style={{ filter: 'drop-shadow(3px 3px 0px #000814)' }} />
                <div>
                  <h3 style={{ margin: 0, fontFamily: "'Silkscreen', monospace", fontWeight: 700, fontSize: '0.95rem', color: '#000814' }}>
                    {user.name || 'Demo Student'}
                  </h3>
                  <p style={{ margin: '2px 0 0', fontSize: '0.78rem', fontFamily: 'monospace', color: '#64748B' }}>
                    {user.email}
                  </p>
                  <span
                    style={{
                      display: 'inline-block',
                      marginTop: '6px',
                      fontSize: '0.65rem',
                      fontFamily: "'Silkscreen', monospace",
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      backgroundColor: '#003566',
                      color: '#FFD60A',
                      padding: '2px 8px',
                      borderRadius: 0,
                      border: '1.5px solid #000814',
                    }}
                  >
                    Role: {user.role}
                  </span>
                </div>
              </div>

              <div style={{ backgroundColor: '#F8F5ED', border: '2px solid #000814', borderRadius: 0, padding: '12px' }}>
                <div style={{ fontSize: '0.78rem', color: '#000814', fontFamily: "'Silkscreen', monospace", fontWeight: 700, marginBottom: '6px' }}>
                  Campus Account Details
                </div>
                <div style={{ fontSize: '0.78rem', fontFamily: 'monospace', color: '#475569', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div>College: Engineering &amp; Technology</div>
                  <div>Account Status: Active (Verified)</div>
                  <div>Default Paper: A4 Standard</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                <button
                  type="button"
                  onClick={handleSwitchRole}
                  className="pixel-btn-navy"
                  style={{
                    flex: 1,
                    padding: '10px',
                    fontSize: '0.75rem',
                  }}
                >
                  Switch to {isStaff ? 'Student' : 'Staff'}
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  style={{
                    padding: '10px 16px',
                    borderRadius: 0,
                    border: '2px solid #000814',
                    backgroundColor: '#FEE2E2',
                    color: '#DC2626',
                    fontFamily: "'Silkscreen', monospace",
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    boxShadow: '2px 2px 0px #000814',
                  }}
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AppLayout;
