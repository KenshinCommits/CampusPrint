const express = require('express');
const db = require('../db');
const { requireAuth, requireStaff } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth, requireStaff);

// Which status can move to which - keeps staff from skipping steps by mistake
const ALLOWED_TRANSITIONS = {
  placed: ['accepted', 'rejected'],
  accepted: ['processing', 'rejected'],
  processing: ['ready'],
  ready: ['completed'],
};

router.get('/orders', async (req, res) => {
  const { status, q } = req.query;
  res.json({ orders: await db.listOrdersStaff({ status, q }) });
});

router.get('/orders/:id/file', async (req, res) => {
  const order = await db.getOrder(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.download(order.fileKey, order.fileName);
});

router.patch('/orders/:id/status', async (req, res) => {
  const { status, reason, estimatedReadyAt } = req.body;
  const order = await db.getOrder(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  const allowed = ALLOWED_TRANSITIONS[order.status] || [];
  if (!allowed.includes(status)) {
    return res.status(400).json({
      error: `Cannot move order from '${order.status}' to '${status}'. Allowed next steps: ${allowed.join(', ') || 'none'}`,
    });
  }
  if (status === 'rejected' && !reason) {
    return res.status(400).json({ error: 'A reason is required when rejecting an order' });
  }

  const updates = { status };
  if (reason) updates.rejectionReason = reason;
  if (estimatedReadyAt) updates.estimatedReadyAt = estimatedReadyAt;

  const updated = await db.updateOrder(order.orderId, updates, {
    status,
    at: new Date().toISOString(),
    by: req.user.email,
    reason: reason || undefined,
  });

  res.json({ order: updated });
});

router.get('/stats', async (req, res) => {
  res.json(await db.getStats());
});

module.exports = router;
