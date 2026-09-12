import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { db } from '../db/index.js';
import { requireAuth } from '../middleware/auth.js';
import { calculateCost } from '../utils/cost.js';
import { countPdfPages } from '../utils/pdf.js';
import { nextOrderToken } from '../utils/token.js';

export const ordersRouter = Router();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => {
      const safe = file.originalname.replace(/[^a-zA-Z0-9_.-]/g, '_');
      cb(null, `${Date.now()}-${safe}`);
    },
  }),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
});

// POST /api/orders  (multipart: file + copies, colorMode, sided, paperSize, binding, notes, pages?, paymentMethod)
ordersRouter.post('/', requireAuth, upload.single('file'), async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'student') {
      return res.status(403).json({ error: 'Only students can place orders' });
    }
    if (!req.file) return res.status(400).json({ error: 'A file upload is required' });

    const { copies, colorMode, sided, paperSize, binding, notes, paymentMethod } = req.body;

    let pages = Number(req.body.pages) || null;
    if (!pages && req.file.mimetype === 'application/pdf') {
      const buffer = fs.readFileSync(req.file.path);
      pages = await countPdfPages(buffer);
    }
    if (!pages) {
      // Couldn't auto-detect (not a PDF, encrypted, etc). Require the student
      // to have supplied it - validation, not a silent guess.
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        error: 'Could not detect page count automatically. Please include a "pages" field.',
      });
    }

    const cost = calculateCost({ pages, copies, colorMode, binding });
    const now = new Date().toISOString();
    const orderId = nextOrderToken();

    const order = {
      orderId,
      userId: req.user.email,
      userName: req.user.name,
      fileName: req.file.originalname,
      fileKey: req.file.filename,
      fileSizeBytes: req.file.size,
      pages,
      options: {
        copies: Math.max(1, Number(copies) || 1),
        colorMode: colorMode === 'color' ? 'color' : 'bw',
        sided: sided === 'double' ? 'double' : 'single',
        paperSize: ['A4', 'A3', 'Letter'].includes(paperSize) ? paperSize : 'A4',
        binding: ['none', 'staple', 'spiral'].includes(binding) ? binding : 'none',
        notes: notes || '',
      },
      cost,
      paymentMethod: paymentMethod === 'counter' ? 'counter' : 'online',
      paymentStatus: 'unpaid',
      status: 'placed',
      rejectionReason: null,
      estimatedReadyAt: null,
      statusHistory: [{ status: 'placed', at: now, by: req.user.email }],
      createdAt: now,
      updatedAt: now,
    };

    await db.orders.create(order);
    res.status(201).json({ order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

ordersRouter.get('/mine', requireAuth, async (req, res) => {
  const orders = await db.orders.findByUser(req.user.email);
  res.json({ orders });
});

const ACTIVE_QUEUE_STATUSES = ['placed', 'accepted', 'processing'];

ordersRouter.get('/:id', requireAuth, async (req, res) => {
  const order = await db.orders.findById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  if (order.userId !== req.user.email && req.user.role !== 'staff') {
    return res.status(403).json({ error: 'Not your order' });
  }

  let queue = null;
  if (ACTIVE_QUEUE_STATUSES.includes(order.status)) {
    const active = (await db.orders.findAll({}))
      .filter((o) => ACTIVE_QUEUE_STATUSES.includes(o.status))
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    const position = active.findIndex((o) => o.orderId === order.orderId) + 1;
    if (position > 0) {
      queue = { position, ahead: position - 1, totalActive: active.length };
    }
  }

  res.json({ order, queue });
});

ordersRouter.get('/:id/file', requireAuth, async (req, res) => {
  const order = await db.orders.findById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  if (order.userId !== req.user.email && req.user.role !== 'staff') {
    return res.status(403).json({ error: 'Not your order' });
  }

  const filePath = path.join(UPLOAD_DIR, order.fileKey);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found on server' });

  const ext = path.extname(order.fileName || '').toLowerCase();
  const mimeMap = {
    '.pdf': 'application/pdf',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.txt': 'text/plain',
  };
  if (mimeMap[ext]) {
    res.setHeader('Content-Type', mimeMap[ext]);
  }
  res.setHeader('Content-Disposition', `inline; filename="${(order.fileName || 'file').replace(/"/g, '')}"`);
  res.sendFile(filePath);
});

ordersRouter.post('/:id/pay', requireAuth, async (req, res) => {
  const order = await db.orders.findById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  if (order.userId !== req.user.email) return res.status(403).json({ error: 'Not your order' });
  if (order.paymentStatus === 'paid') return res.json({ order });

  const updated = await db.orders.update(order.orderId, {
    paymentStatus: 'paid',
    updatedAt: new Date().toISOString(),
  });
  res.json({ order: updated });
});

ordersRouter.delete('/:id', requireAuth, async (req, res) => {
  const order = await db.orders.findById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  if (order.userId !== req.user.email) return res.status(403).json({ error: 'Not your order' });
  if (order.status !== 'placed') {
    return res.status(400).json({ error: 'Only orders that have not been accepted yet can be cancelled' });
  }

  const now = new Date().toISOString();
  const updated = await db.orders.update(order.orderId, {
    status: 'cancelled',
    updatedAt: now,
    statusHistory: [...order.statusHistory, { status: 'cancelled', at: now, by: req.user.email }],
  });
  res.json({ order: updated });
});
