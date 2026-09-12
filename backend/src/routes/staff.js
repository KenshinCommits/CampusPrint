import { Router } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { db } from '../db/index.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

export const staffRouter = Router();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads');

const VALID_STATUSES = ['placed', 'accepted', 'rejected', 'processing', 'ready', 'completed', 'cancelled'];

staffRouter.use(requireAuth, requireRole('staff'));

// GET /api/staff/orders?status=&q=
staffRouter.get('/orders', async (req, res) => {
  const { status, q } = req.query;
  const orders = await db.orders.findAll({ status: status || undefined, q: q || undefined });
  res.json({ orders });
});

staffRouter.get('/orders/:id', async (req, res) => {
  const order = await db.orders.findById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json({ order });
});

// GET /api/staff/orders/:id/file - download the original uploaded document
staffRouter.get('/orders/:id/file', async (req, res) => {
  const order = await db.orders.findById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  const filePath = path.join(UPLOAD_DIR, order.fileKey);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found on server' });

  res.download(filePath, order.fileName);
});

// PATCH /api/staff/orders/:id/status  { status, reason?, estimatedReadyAt? }
staffRouter.patch('/orders/:id/status', async (req, res) => {
  const { status, reason, estimatedReadyAt } = req.body;
  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: `status must be one of: ${VALID_STATUSES.join(', ')}` });
  }
  if (status === 'rejected' && !reason) {
    return res.status(400).json({ error: 'A reason is required when rejecting an order' });
  }

  const order = await db.orders.findById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  const now = new Date().toISOString();
  const patch = {
    status,
    updatedAt: now,
    statusHistory: [...order.statusHistory, { status, at: now, by: req.user.email }],
  };
  if (status === 'rejected') patch.rejectionReason = reason;
  if (estimatedReadyAt) patch.estimatedReadyAt = estimatedReadyAt;

  const updated = await db.orders.update(order.orderId, patch);
  res.json({ order: updated });
});

// GET /api/staff/stats - quick counts and analytics for the dashboard
staffRouter.get('/stats', async (req, res) => {
  const orders = await db.orders.findAll({});
  const counts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});
  const today = new Date().toISOString().slice(0, 10);
  const todayOrders = orders.filter((o) => o.createdAt && o.createdAt.slice(0, 10) === today);
  const totalRevenue = orders.reduce((sum, o) => sum + (o.cost?.total || 0), 0);
  const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.cost?.total || 0), 0);
  const totalPages = orders.reduce((sum, o) => sum + (o.pages || 0), 0);
  const totalColorPages = orders.reduce((sum, o) => sum + (o.options?.colorMode === 'color' ? (o.pages || 0) : 0), 0);

  res.json({
    total: orders.length,
    totalOrders: orders.length,
    today: todayOrders.length,
    todayTotal: todayOrders.length,
    byStatus: counts,
    counts,
    revenue: {
      total: totalRevenue,
      today: todayRevenue,
    },
    totalPages,
    totalColorPages,
    totalBwPages: totalPages - totalColorPages,
  });
});
