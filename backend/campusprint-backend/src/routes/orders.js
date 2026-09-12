const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');
const { countPages } = require('../utils/pdf');
const { computeCost } = require('../utils/cost');

const router = express.Router();

const upload = multer({
  dest: path.join(__dirname, '..', '..', 'uploads'),
});

// Create a new order: upload file + choose print options -> get cost + token
router.post('/', requireAuth, upload.single('file'), async (req, res) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ error: 'Only students can place orders' });
  }
  if (!req.file) {
    return res.status(400).json({ error: 'A file upload is required' });
  }

  const { copies, colorMode, sided, paperSize, binding, notes, manualPages, paymentMethod } = req.body;
  const copiesNum = parseInt(copies, 10) || 1;

  const pages = await countPages(req.file.path, manualPages);
  const cost = computeCost({ colorMode, pages, copies: copiesNum, binding });

  const order = await db.createOrder({
    userId: req.user.email,
    userName: req.user.name,
    fileName: req.file.originalname,
    fileKey: req.file.path,
    fileSizeBytes: req.file.size,
    pages,
    options: {
      copies: copiesNum,
      colorMode: colorMode || 'bw',
      sided: sided || 'single',
      paperSize: paperSize || 'A4',
      binding: binding || 'none',
      notes: notes || '',
    },
    cost,
    paymentMethod: paymentMethod || 'counter',
  });

  res.status(201).json({ order });
});

router.get('/mine', requireAuth, async (req, res) => {
  res.json({ orders: await db.listOrdersByUser(req.user.email) });
});

router.get('/:id', requireAuth, async (req, res) => {
  const order = await db.getOrder(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  if (order.userId !== req.user.email && req.user.role !== 'staff') {
    return res.status(403).json({ error: 'Not your order' });
  }
  res.json({ order });
});

router.get('/:id/file', requireAuth, async (req, res) => {
  const order = await db.getOrder(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  if (order.userId !== req.user.email && req.user.role !== 'staff') {
    return res.status(403).json({ error: 'Not your order' });
  }

  const filePath = path.isAbsolute(order.fileKey)
    ? order.fileKey
    : path.join(__dirname, '..', '..', 'uploads', order.fileKey);
  const fs = require('fs');
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

// Simulated payment
router.post('/:id/pay', requireAuth, async (req, res) => {
  const order = await db.getOrder(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  if (order.userId !== req.user.email) return res.status(403).json({ error: 'Not your order' });

  const updated = await db.updateOrder(
    order.orderId,
    { paymentStatus: 'paid' },
    { status: order.status, at: new Date().toISOString(), by: req.user.email, note: 'Payment simulated' }
  );
  res.json({ order: updated });
});

// Cancel - only allowed before staff has accepted it
router.delete('/:id', requireAuth, async (req, res) => {
  const order = await db.getOrder(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  if (order.userId !== req.user.email) return res.status(403).json({ error: 'Not your order' });
  if (order.status !== 'placed') {
    return res.status(400).json({ error: 'Can only cancel an order that has not been accepted yet' });
  }

  const updated = await db.updateOrder(
    order.orderId,
    { status: 'cancelled' },
    { status: 'cancelled', at: new Date().toISOString(), by: req.user.email }
  );
  res.json({ order: updated });
});

module.exports = router;
