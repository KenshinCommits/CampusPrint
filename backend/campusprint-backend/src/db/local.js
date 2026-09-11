// Super simple "database" that's really just a JSON file on disk.
// Good enough for a 2-hour build and a live demo. No setup required.
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', '..', 'data', 'db.json');

function readDB() {
  if (!fs.existsSync(DB_PATH)) {
    const initial = { users: [], orders: [], orderCounter: 1000 };
    fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2));
    return initial;
  }
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// ---- Users ----
function createUser(user) {
  const db = readDB();
  db.users.push(user);
  writeDB(db);
  return user;
}

function getUserByEmail(email) {
  const db = readDB();
  return db.users.find((u) => u.email === email) || null;
}

// ---- Orders ----
function createOrder(orderData) {
  const db = readDB();
  db.orderCounter += 1;
  const orderId = `CP-${db.orderCounter}`;
  const now = new Date().toISOString();
  const order = {
    orderId,
    ...orderData,
    status: 'placed',
    paymentStatus: 'unpaid',
    statusHistory: [{ status: 'placed', at: now, by: orderData.userId }],
    createdAt: now,
    updatedAt: now,
  };
  db.orders.push(order);
  writeDB(db);
  return order;
}

function getOrder(orderId) {
  const db = readDB();
  return db.orders.find((o) => o.orderId === orderId) || null;
}

function listOrdersByUser(userId) {
  const db = readDB();
  return db.orders
    .filter((o) => o.userId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function listOrdersStaff({ status, q } = {}) {
  const db = readDB();
  let orders = db.orders;
  if (status) orders = orders.filter((o) => o.status === status);
  if (q) {
    const needle = q.toLowerCase();
    orders = orders.filter(
      (o) =>
        o.orderId.toLowerCase().includes(needle) ||
        (o.userName || '').toLowerCase().includes(needle) ||
        (o.fileName || '').toLowerCase().includes(needle)
    );
  }
  return orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function updateOrder(orderId, updates, historyEntry) {
  const db = readDB();
  const idx = db.orders.findIndex((o) => o.orderId === orderId);
  if (idx === -1) return null;
  const order = db.orders[idx];
  Object.assign(order, updates, { updatedAt: new Date().toISOString() });
  if (historyEntry) order.statusHistory.push(historyEntry);
  db.orders[idx] = order;
  writeDB(db);
  return order;
}

function getStats() {
  const db = readDB();
  const today = new Date().toISOString().slice(0, 10);
  const counts = {};
  let todayTotal = 0;
  for (const o of db.orders) {
    counts[o.status] = (counts[o.status] || 0) + 1;
    if (o.createdAt.slice(0, 10) === today) todayTotal += 1;
  }
  return { counts, todayTotal, totalOrders: db.orders.length };
}

module.exports = {
  createUser,
  getUserByEmail,
  createOrder,
  getOrder,
  listOrdersByUser,
  listOrdersStaff,
  updateOrder,
  getStats,
};
