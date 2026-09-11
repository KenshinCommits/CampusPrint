import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { api } from '../api/client.js';
import { useAuth } from './AuthContext.jsx';
import { useToast } from './ToastContext.jsx';

const NotificationContext = createContext(null);
let idCounter = 0;

const STUDENT_MESSAGES = {
  accepted: (o) => `✓ Your order ${o.orderId} was accepted.`,
  processing: (o) => `⚡ ${o.orderId} is now being printed.`,
  ready: (o) => `🎉 ${o.orderId} is ready for pickup!`,
  completed: (o) => `✅ ${o.orderId} was marked as collected.`,
  rejected: (o) => `⚠ ${o.orderId} was rejected — view reason.`,
};

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const seenRef = useRef(new Map());
  const firstLoadRef = useRef(true);

  function push(text, tone = 'info') {
    idCounter += 1;
    setNotifications((n) => [{ id: idCounter, text, at: new Date().toISOString() }, ...n].slice(0, 30));
    setUnread((u) => u + 1);
    toast(text, tone);
  }

  useEffect(() => {
    seenRef.current = new Map();
    firstLoadRef.current = true;
    setNotifications([]);
    setUnread(0);
    if (!user) return undefined;

    async function tick() {
      try {
        if (user.role === 'student') {
          const { orders } = await api.myOrders();
          orders.forEach((o) => {
            const prev = seenRef.current.get(o.orderId);
            if (!firstLoadRef.current && prev && prev !== o.status) {
              const make = STUDENT_MESSAGES[o.status];
              if (make) push(make(o), o.status === 'rejected' ? 'error' : o.status === 'ready' ? 'success' : 'info');
            }
            seenRef.current.set(o.orderId, o.status);
          });
        } else if (user.role === 'staff') {
          const { orders } = await api.staffOrders({});
          orders.forEach((o) => {
            const prev = seenRef.current.get(o.orderId);
            if (!firstLoadRef.current && !prev && o.status === 'placed') {
              push(`🆕 New order ${o.orderId} from ${o.userName}.`, 'info');
            }
            seenRef.current.set(o.orderId, o.status);
          });
        }
      } catch {
        // Silent - polling should never surface errors to the user.
      } finally {
        firstLoadRef.current = false;
      }
    }

    tick();
    const interval = setInterval(tick, 7000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email]);

  function markAllRead() {
    setUnread(0);
  }

  return (
    <NotificationContext.Provider value={{ notifications, unread, markAllRead }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used inside <NotificationProvider>');
  return ctx;
}
