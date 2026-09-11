import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Zero-setup JSON-file "database" so the whole team can build and demo
// against real data without anyone touching AWS first. Swap DB_DRIVER to
// "dynamodb" later - the rest of the app never touches this file directly,
// it only calls the functions this module exports (see db/index.js).

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, '[]');
  if (!fs.existsSync(ORDERS_FILE)) fs.writeFileSync(ORDERS_FILE, '[]');
}

function readJson(file) {
  ensureStore();
  return JSON.parse(fs.readFileSync(file, 'utf-8'));
}

function writeJson(file, data) {
  ensureStore();
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

export const localDb = {
  users: {
    async create(user) {
      const users = readJson(USERS_FILE);
      users.push(user);
      writeJson(USERS_FILE, users);
      return user;
    },
    async findByEmail(email) {
      const users = readJson(USERS_FILE);
      return users.find((u) => u.email === email) || null;
    },
  },
  orders: {
    async create(order) {
      const orders = readJson(ORDERS_FILE);
      orders.push(order);
      writeJson(ORDERS_FILE, orders);
      return order;
    },
    async findById(orderId) {
      const orders = readJson(ORDERS_FILE);
      return orders.find((o) => o.orderId === orderId) || null;
    },
    async findByUser(userEmail) {
      const orders = readJson(ORDERS_FILE);
      return orders
        .filter((o) => o.userId === userEmail)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    },
    async findAll({ status, q } = {}) {
      let orders = readJson(ORDERS_FILE);
      if (status) orders = orders.filter((o) => o.status === status);
      if (q) {
        const needle = q.toLowerCase();
        orders = orders.filter(
          (o) =>
            o.orderId.toLowerCase().includes(needle) ||
            (o.userName || '').toLowerCase().includes(needle) ||
            (o.userId || '').toLowerCase().includes(needle) ||
            (o.fileName || '').toLowerCase().includes(needle)
        );
      }
      return orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    },
    async update(orderId, patch) {
      const orders = readJson(ORDERS_FILE);
      const idx = orders.findIndex((o) => o.orderId === orderId);
      if (idx === -1) return null;
      orders[idx] = { ...orders[idx], ...patch };
      writeJson(ORDERS_FILE, orders);
      return orders[idx];
    },
  },
};
