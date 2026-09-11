import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { StatusBadge } from '../components/StatusBadge.jsx';
import { StatusTimeline } from '../components/StatusTimeline.jsx';
import { Button } from '../components/Button.jsx';
import { OptionCard } from '../components/OptionCard.jsx';
import { Modal } from '../components/Modal.jsx';
import { EmptyState, Loader } from '../components/EmptyState.jsx';
import { NEXT_ACTIONS } from '../components/QueueTable.jsx';
import {
  formatCurrency,
  formatFileSize,
  minutesUntil,
  optionsSummary,
  COLOR_LABEL,
  SIDED_LABEL,
  BINDING_LABEL,
} from '../utils/format.js';

export function OrderDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [queue, setQueue] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function load() {
    try {
      const res = await api.getOrder(id);
      setOrder(res.order);
      setQueue(res.queue);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    setOrder(null);
    setError('');
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function pay() {
    setBusy(true);
    try {
      const { order } = await api.payOrder(id);
      setOrder(order);
      toast('PAYMENT SUCCESSFUL ✓', 'success');
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setBusy(false);
    }
  }

  async function cancel() {
    setBusy(true);
    try {
      const { order } = await api.cancelOrder(id);
      setOrder(order);
      toast('Order cancelled.', 'info');
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setBusy(false);
    }
  }

  async function updateStatus(status, extra) {
    setBusy(true);
    try {
      const { order } = await api.updateStatus(id, { status, ...extra });
      setOrder(order);
      setQueue(null);
      toast(status === 'completed' ? 'ORDER COLLECTED ✓' : `Order moved to ${status}.`, 'success');
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setBusy(false);
    }
  }

  if (error) return <EmptyState icon="⚠" title="THAT DIDN'T WORK" subtitle={error} />;
  if (!order) return <Loader />;

  const isStaff = user?.role === 'staff';

  return isStaff ? (
    <StaffView order={order} onAction={updateStatus} busy={busy} navigate={navigate} />
  ) : (
    <StudentView order={order} queue={queue} onPay={pay} onCancel={cancel} busy={busy} />
  );
}

function PaymentChooser({ onPay, busy }) {
  const [choice, setChoice] = useState(null);

  if (choice === 'counter') return <p className="muted" style={{ margin: 0 }}>PAYMENT DUE AT COUNTER</p>;

  if (choice === 'online') {
    return (
      <div>
        <p className="hint">Simulated payment — no real transaction occurs.</p>
        <Button onClick={onPay} disabled={busy}>SIMULATE PAYMENT →</Button>
      </div>
    );
  }

  return (
    <div className="option-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
      <OptionCard title="Pay Online" sub="Simulated" onClick={() => setChoice('online')} />
      <OptionCard title="Pay At Counter" onClick={() => setChoice('counter')} tone="blue" />
    </div>
  );
}

function StudentView({ order, queue, onPay, onCancel, busy }) {
  const isPlaced = order.status === 'placed';
  const isRejected = order.status === 'rejected';

  return (
    <div className="container medium">
      {isPlaced ? (
        <div className="card" style={{ textAlign: 'center', marginBottom: 24 }}>
          <span className="eyebrow">ORDER CONFIRMED</span>
          <h1>YOU'RE IN THE QUEUE.</h1>
          <p className="muted upper" style={{ fontSize: '0.78rem', fontWeight: 700, marginBottom: 2 }}>Your Print Token</p>
          <div className="mono-token" style={{ fontSize: '2.6rem' }}>{order.orderId}</div>
          {queue && (
            <div style={{ marginTop: 14 }}>
              <p style={{ margin: 0, fontWeight: 700 }}>POSITION #{String(queue.position).padStart(2, '0')}</p>
              <p className="muted" style={{ margin: 0 }}>
                {queue.ahead} order{queue.ahead === 1 ? '' : 's'} ahead of you
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="row between" style={{ marginBottom: 18, flexWrap: 'wrap', gap: 10 }}>
          <h1 style={{ margin: 0 }}>ORDER {order.orderId}</h1>
          <StatusBadge status={order.status} />
        </div>
      )}

      {isRejected && (
        <div className="alert-coral">
          <h3>ORDER REJECTED</h3>
          <p style={{ margin: 0 }}>Reason: {order.rejectionReason}</p>
        </div>
      )}

      {isPlaced && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 className="upper">Payment</h3>
          {order.paymentStatus === 'paid' ? (
            <p style={{ margin: 0, fontWeight: 700 }}>PAYMENT SUCCESSFUL ✓</p>
          ) : (
            <PaymentChooser onPay={onPay} busy={busy} />
          )}
        </div>
      )}

      {!isRejected && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 className="upper">Status</h3>
          <StatusTimeline statusHistory={order.statusHistory} status={order.status} estimatedReadyAt={order.estimatedReadyAt} />
          {order.status !== 'completed' && order.estimatedReadyAt && (
            <p className="hint" style={{ marginTop: 10 }}>Estimated ready in ~{minutesUntil(order.estimatedReadyAt)} min</p>
          )}
        </div>
      )}

      <div className="card">
        <h3 className="upper">Details</h3>
        <div className="stack" style={{ gap: 6 }}>
          <div className="row between"><span className="muted">File</span><span>{order.fileName}</span></div>
          <div className="row between"><span className="muted">Pages</span><span>{order.pages}</span></div>
          <div className="row between"><span className="muted">Copies</span><span>{order.options.copies}</span></div>
          <div className="row between"><span className="muted">Options</span><span style={{ textAlign: 'right' }}>{optionsSummary(order.options)}</span></div>
          {order.options.notes && <div className="row between"><span className="muted">Notes</span><span style={{ textAlign: 'right' }}>{order.options.notes}</span></div>}
          <hr className="divider" />
          <div className="row between"><span className="muted">Print cost</span><span>{formatCurrency(order.cost.printCost)}</span></div>
          <div className="row between"><span className="muted">Binding</span><span>{formatCurrency(order.cost.bindingCost)}</span></div>
          <div className="row between"><strong>Total</strong><strong>{formatCurrency(order.cost.total)}</strong></div>
          <div className="row between">
            <span className="muted">Payment status</span>
            <span className={`badge ${order.paymentStatus === 'paid' ? 'badge-ready' : 'badge-placed'}`}>
              {order.paymentStatus === 'paid' ? 'PAID' : 'UNPAID'}
            </span>
          </div>
        </div>
      </div>

      {isPlaced && (
        <div style={{ marginTop: 20 }}>
          <Button variant="danger" onClick={onCancel} disabled={busy}>CANCEL ORDER</Button>
        </div>
      )}
    </div>
  );
}

function StaffView({ order, onAction, busy, navigate }) {
  const [modal, setModal] = useState(null);
  const [reason, setReason] = useState('');
  const [etaMinutes, setEtaMinutes] = useState('15');

  const actions = NEXT_ACTIONS[order.status] || [];
  const ext = (order.fileName.split('.').pop() || '').toUpperCase().slice(0, 4);

  function trigger(action) {
    if (action.needsReason) {
      setReason('');
      setModal({ type: 'reject' });
      return;
    }
    if (action.needsEta) {
      setEtaMinutes('15');
      setModal({ type: 'eta', action });
      return;
    }
    onAction(action.status, {});
  }

  function confirmReject() {
    if (!reason.trim()) return;
    onAction('rejected', { reason });
    setModal(null);
  }

  function confirmEta() {
    const mins = Number(etaMinutes);
    const extra = mins > 0 ? { estimatedReadyAt: new Date(Date.now() + mins * 60000).toISOString() } : {};
    onAction(modal.action.status, extra);
    setModal(null);
  }

  return (
    <div className="container">
      <button className="btn-ghost" onClick={() => navigate('/staff')} style={{ marginBottom: 14 }}>
        ← Back to Queue
      </button>

      <div className="row between" style={{ marginBottom: 18, flexWrap: 'wrap', gap: 10 }}>
        <h1 style={{ margin: 0 }}>ORDER {order.orderId}</h1>
        <StatusBadge status={order.status} />
      </div>

      {order.status === 'rejected' && (
        <div className="alert-coral">
          <h3>ORDER REJECTED</h3>
          <p style={{ margin: 0 }}>Reason: {order.rejectionReason}</p>
        </div>
      )}

      <div className="two-col">
        <div className="card">
          <h3 className="upper">Document</h3>
          <div className="file-chip" style={{ marginBottom: 16 }}>
            <div className="file-icon">{ext || 'FILE'}</div>
            <div className="file-info">
              <div className="file-name">{order.fileName}</div>
              <div className="file-meta">{formatFileSize(order.fileSizeBytes)} · {order.pages} pages</div>
            </div>
          </div>
          <Button as="a" href={api.staffFileUrl(order.orderId)} target="_blank" rel="noreferrer" variant="dark">
            Download File
          </Button>

          <h3 className="upper" style={{ marginTop: 28 }}>Status History</h3>
          <StatusTimeline statusHistory={order.statusHistory} status={order.status} estimatedReadyAt={order.estimatedReadyAt} />
        </div>

        <div className="card">
          <h3 className="upper">Print Requirements</h3>
          <div className="stack" style={{ gap: 6, marginBottom: 18 }}>
            <div className="row between"><span className="muted">Student</span><span>{order.userName}</span></div>
            <div className="row between"><span className="muted">Copies</span><span>{order.options.copies}</span></div>
            <div className="row between"><span className="muted">Color</span><span>{COLOR_LABEL[order.options.colorMode]}</span></div>
            <div className="row between"><span className="muted">Sides</span><span>{SIDED_LABEL[order.options.sided]}</span></div>
            <div className="row between"><span className="muted">Paper</span><span>{order.options.paperSize}</span></div>
            <div className="row between"><span className="muted">Binding</span><span>{BINDING_LABEL[order.options.binding]}</span></div>
            {order.options.notes && <div className="row between"><span className="muted">Notes</span><span style={{ textAlign: 'right' }}>{order.options.notes}</span></div>}
            <hr className="divider" />
            <div className="row between"><strong>Total</strong><strong>{formatCurrency(order.cost.total)}</strong></div>
          </div>

          <div className="row between" style={{ marginBottom: 18 }}>
            <span className="field-label" style={{ margin: 0 }}>Payment</span>
            <span className={`badge ${order.paymentStatus === 'paid' ? 'badge-ready' : 'badge-placed'}`}>
              {order.paymentStatus === 'paid' ? 'PAID' : 'PAYMENT DUE'}
            </span>
          </div>

          <div className="btn-row">
            {actions.map((a) => (
              <Button key={a.status} variant={a.variant} onClick={() => trigger(a)} disabled={busy}>
                {a.label}
              </Button>
            ))}
            {actions.length === 0 && order.status !== 'rejected' && order.status !== 'cancelled' && (
              <p className="muted" style={{ margin: 0 }}>No further action needed — order is complete.</p>
            )}
          </div>
        </div>
      </div>

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
          <div className="field" style={{ marginBottom: 0 }}>
            <label>Minutes from now</label>
            <input type="number" min="1" value={etaMinutes} onChange={(e) => setEtaMinutes(e.target.value)} autoFocus />
          </div>
        </Modal>
      )}
    </div>
  );
}
