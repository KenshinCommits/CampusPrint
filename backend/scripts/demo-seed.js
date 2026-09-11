// Seeds a realistic, varied set of demo orders (all statuses represented)
// so the staff dashboard and student "My Orders" screens are never empty
// for a demo/judging session. Safe to re-run - it always creates fresh
// orders (new tokens), it does not delete existing data.
// Run with: npm run seed:demo

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { db } from '../src/db/index.js';
import { calculateCost } from '../src/utils/cost.js';
import { nextOrderToken } from '../src/utils/token.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

async function upsertUser({ name, email, password, role }) {
  const existing = await db.users.findByEmail(email);
  if (existing) return existing;
  const passwordHash = await bcrypt.hash(password, 10);
  const user = { email, name, passwordHash, role, createdAt: new Date().toISOString() };
  await db.users.create(user);
  return user;
}

function placeholderFile(fileName, sizeBytes) {
  const fileKey = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${fileName}`;
  const filler = `CampusPrint demo file - ${fileName}\n`;
  const buf = Buffer.alloc(sizeBytes, filler.repeat(Math.ceil(sizeBytes / filler.length)).slice(0, sizeBytes));
  fs.writeFileSync(path.join(UPLOAD_DIR, fileKey), buf);
  return fileKey;
}

function minutesFromNow(mins) {
  return new Date(Date.now() + mins * 60000).toISOString();
}

async function makeOrder({
  user,
  fileName,
  pages,
  copies = 1,
  colorMode = 'bw',
  sided = 'single',
  paperSize = 'A4',
  binding = 'none',
  notes = '',
  paymentMethod = 'online',
  paymentStatus = 'unpaid',
  status = 'placed',
  rejectionReason = null,
  estimatedReadyAt = null,
  createdAt = new Date().toISOString(),
  history = [],
}) {
  const cost = calculateCost({ pages, copies, colorMode, binding });
  const orderId = nextOrderToken();
  const fileSizeBytes = Math.max(4096, Math.round(pages * 18 * 1024));
  const fileKey = placeholderFile(fileName, fileSizeBytes);

  const statusHistory =
    history.length > 0
      ? history
      : [{ status: 'placed', at: createdAt, by: user.email }, ...(status !== 'placed' ? [{ status, at: createdAt, by: 'staff@campusprint.demo' }] : [])];

  const order = {
    orderId,
    userId: user.email,
    userName: user.name,
    fileName,
    fileKey,
    fileSizeBytes,
    pages,
    options: { copies, colorMode, sided, paperSize, binding, notes },
    cost,
    paymentMethod,
    paymentStatus,
    status,
    rejectionReason,
    estimatedReadyAt,
    statusHistory,
    createdAt,
    updatedAt: statusHistory[statusHistory.length - 1].at,
  };

  await db.orders.create(order);
  console.log(`Seeded ${orderId} — ${fileName} (${status})`);
  return order;
}

async function main() {
  const demoStudent = await upsertUser({
    name: 'Demo Student',
    email: 'student@campusprint.demo',
    password: 'student123',
    role: 'student',
  });
  const rahul = await upsertUser({ name: 'Rahul Verma', email: 'rahul@campusprint.demo', password: 'demo123', role: 'student' });
  const ananya = await upsertUser({ name: 'Ananya Iyer', email: 'ananya@campusprint.demo', password: 'demo123', role: 'student' });
  const karthik = await upsertUser({ name: 'Karthik Rao', email: 'karthik@campusprint.demo', password: 'demo123', role: 'student' });
  const sneha = await upsertUser({ name: 'Sneha Kapoor', email: 'sneha@campusprint.demo', password: 'demo123', role: 'student' });
  const vikram = await upsertUser({ name: 'Vikram Singh', email: 'vikram@campusprint.demo', password: 'demo123', role: 'student' });

  const yesterday = new Date(Date.now() - 20 * 3600 * 1000).toISOString();

  // The student's own active order - shows up as "current order" on their dashboard.
  await makeOrder({
    user: demoStudent,
    fileName: 'lecture-notes.pdf',
    pages: 8,
    paymentMethod: 'counter',
    paymentStatus: 'unpaid',
    status: 'placed',
  });

  await makeOrder({
    user: rahul,
    fileName: 'assignment.pdf',
    pages: 12,
    sided: 'double',
    paymentStatus: 'paid',
    status: 'processing',
    estimatedReadyAt: minutesFromNow(12),
    history: [
      { status: 'placed', at: minutesFromNow(-30), by: rahul.email },
      { status: 'accepted', at: minutesFromNow(-22), by: 'staff@campusprint.demo' },
      { status: 'processing', at: minutesFromNow(-5), by: 'staff@campusprint.demo' },
    ],
  });

  await makeOrder({
    user: ananya,
    fileName: 'resume.pdf',
    pages: 3,
    copies: 2,
    paymentStatus: 'paid',
    status: 'ready',
    estimatedReadyAt: minutesFromNow(-1),
    history: [
      { status: 'placed', at: minutesFromNow(-40), by: ananya.email },
      { status: 'accepted', at: minutesFromNow(-35), by: 'staff@campusprint.demo' },
      { status: 'processing', at: minutesFromNow(-20), by: 'staff@campusprint.demo' },
      { status: 'ready', at: minutesFromNow(-1), by: 'staff@campusprint.demo' },
    ],
  });

  await makeOrder({
    user: karthik,
    fileName: 'project-report.pdf',
    pages: 28,
    sided: 'double',
    binding: 'spiral',
    paymentMethod: 'counter',
    paymentStatus: 'unpaid',
    status: 'accepted',
    history: [
      { status: 'placed', at: minutesFromNow(-15), by: karthik.email },
      { status: 'accepted', at: minutesFromNow(-8), by: 'staff@campusprint.demo' },
    ],
  });

  await makeOrder({
    user: demoStudent,
    fileName: 'notes.pdf',
    pages: 15,
    copies: 2,
    binding: 'staple',
    paymentStatus: 'paid',
    status: 'completed',
    createdAt: yesterday,
    history: [
      { status: 'placed', at: yesterday, by: demoStudent.email },
      { status: 'accepted', at: yesterday, by: 'staff@campusprint.demo' },
      { status: 'processing', at: yesterday, by: 'staff@campusprint.demo' },
      { status: 'ready', at: yesterday, by: 'staff@campusprint.demo' },
      { status: 'completed', at: yesterday, by: 'staff@campusprint.demo' },
    ],
  });

  await makeOrder({
    user: sneha,
    fileName: 'presentation.pdf',
    pages: 20,
    colorMode: 'color',
    binding: 'staple',
    paymentStatus: 'unpaid',
    status: 'rejected',
    rejectionReason: 'File contains unsupported pages.',
    history: [
      { status: 'placed', at: minutesFromNow(-25), by: sneha.email },
      { status: 'rejected', at: minutesFromNow(-20), by: 'staff@campusprint.demo' },
    ],
  });

  await makeOrder({
    user: vikram,
    fileName: 'lab-manual.pdf',
    pages: 6,
    copies: 3,
    binding: 'staple',
    paymentStatus: 'paid',
    status: 'placed',
  });

  await makeOrder({
    user: demoStudent,
    fileName: 'id-photo.pdf',
    pages: 1,
    copies: 4,
    colorMode: 'color',
    paymentStatus: 'unpaid',
    status: 'cancelled',
    history: [
      { status: 'placed', at: minutesFromNow(-60), by: demoStudent.email },
      { status: 'cancelled', at: minutesFromNow(-58), by: demoStudent.email },
    ],
  });

  console.log('Demo seed complete.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
