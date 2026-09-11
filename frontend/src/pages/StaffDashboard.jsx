import { useEffect, useState } from 'react';
import { api } from '../api/client.js';
import { useToast } from '../context/ToastContext.jsx';
import { StatCard } from '../components/StatCard.jsx';
import { QueueTable } from '../components/QueueTable.jsx';
import { Modal } from '../components/Modal.jsx';
import { Button } from '../components/Button.jsx';
import { EmptyState, Loader } from '../components/EmptyState.jsx';

const STATUS_FILTERS = ['', 'placed', 'accepted', 'processing', 'ready', 'completed', 'rejected', 'cancelled'];

export function StaffDashboard() {
  const { toast } = useToast();
  const [orders, setOrders] = useState(null);
  const [stats, setStats] = useState(null);
  const [status, setStatus] = useState('');
  const [q, setQ] = useState('');
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [modal, setModal] = useState(null); // { type: 'reject'|'eta', order, action }
  const [reason, setReason] = useState('');
  const [etaMinutes, setEtaMinutes] = useState('15');

  async function load() {
    try {
      const [{ orders }, statsRes] = await Promise.all([api.staffOrders({ status, q }), api.staffStats()]);
      setOrders(orders);
      setStats(statsRes);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 8000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, q]);

  function handleAction(order, action) {
    if (action.needsReason) {
      setReason('');
      setModal({ type: 'reject', order });
      return;
    }
    if (action.needsEta) {
      setEtaMinutes('15');
      setModal({ type: 'eta', order, action });
      return;
    }
    runUpdate(order, action.status, {});
  }

  async function runUpdate(order, nextStatus, extra) {
    setBusyId(order.orderId);
    try {
      await api.updateStatus(order.orderId, { status: nextStatus, ...extra });
      toast(nextStatus === 'completed' ? `${order.orderId} — ORDER COLLECTED ✓` : `${order.orderId} moved to ${nextStatus}.`, 'success');
      await load();
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setBusyId(null);
    }
  }

  function confirmReject() {
    if (!reason.trim()) return;
    runUpdate(modal.order, 'rejected', { reason });
    setModal(null);
  }

  function confirmEta() {
    const mins = Number(etaMinutes);
    const extra = mins > 0 ? { estimatedReadyAt: new Date(Date.now() + mins * 60000).toISOString() } : {};
    runUpdate(modal.order, modal.action.status, extra);
    setModal(null);
  }

  if (error) return <EmptyState icon="⚠" title="THAT DIDN'T WORK" subtitle={error} />;
  if (orders === null || !stats) return <Loader />;

  const byStatus = stats.byStatus || {};

  return (
    <div className="container">
      <h1>SHOP QUEUE</h1>
      <p className="muted" style={{ marginBottom: 22 }}>Live view of every order moving through the shop.</p>

      <div className="grid grid-auto" style={{ marginBottom: 26 }}>
        <StatCard label="New Orders" value={byStatus.placed || 0} tone="yellow" />
        <StatCard label="Accepted" value={byStatus.accepted || 0} tone="blue" />
        <StatCard label="Processing" value={byStatus.processing || 0} tone="blue" />
        <StatCard label="Ready" value={byStatus.ready || 0} tone="lime" />
        <StatCard label="Completed" value={byStatus.completed || 0} tone="dark" />
        <StatCard label="Today's Orders" value={stats.today} />
      </div>

      <div className="row" style={{ marginBottom: 20, gap: 12 }}>
        <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ width: 'auto', minWidth: 160 }}>
          {STATUS_FILTERS.map((s) => (
            <option key={s} value={s}>
              {s === '' ? 'All statuses' : s}
            </option>
          ))}
        </select>
        <input
          placeholder="SEARCH TOKEN, STUDENT OR FILE…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ flex: 1, minWidth: 220 }}
        />
      </div>

      {orders.length === 0 ? (
        <EmptyState icon="📭" title="NOTHING HERE YET." subtitle="No orders match this filter." />
      ) : (
        <QueueTable orders={orders} busyId={busyId} onAction={handleAction} />
      )}

      {modal?.type === 'reject' && (
        <Modal
          title="WHY ARE YOU REJECTING THIS ORDER?"
          onClose={() => setModal(null)}
          footer={
            <>
              <Button variant="danger" onClick={confirmReject} disabled={!reason.trim()}>Reject Order</Button>
              <Button variant="ghost" onClick={() => setModal(null)}>Cancel</Button>
            </>
          }
        >
          <p className="muted">{modal.order.orderId} — {modal.order.fileName}</p>
          <textarea placeholder="Enter reason…" value={reason} onChange={(e) => setReason(e.target.value)} rows={3} autoFocus />
        </Modal>
      )}

      {modal?.type === 'eta' && (
        <Modal
          title="ESTIMATED READY TIME"
          onClose={() => setModal(null)}
          footer={
            <>
              <Button onClick={confirmEta}>Confirm</Button>
              <Button variant="ghost" onClick={() => setModal(null)}>Cancel</Button>
            </>
          }
        >
          <p className="muted">{modal.order.orderId} — {modal.order.fileName}</p>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>Minutes from now</label>
            <input type="number" min="1" value={etaMinutes} onChange={(e) => setEtaMinutes(e.target.value)} autoFocus />
          </div>
        </Modal>
      )}
    </div>
  );
}
