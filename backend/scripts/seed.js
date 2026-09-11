// Seeds one staff account + one student account so you never have to sign
// up manually during a demo. Works against whichever DB_DRIVER is active.
// Run with: npm run seed

import bcrypt from 'bcryptjs';
import { db } from '../src/db/index.js';

async function upsertUser({ name, email, password, role }) {
  const existing = await db.users.findByEmail(email);
  if (existing) {
    console.log(`Already exists: ${email}`);
    return;
  }
  const passwordHash = await bcrypt.hash(password, 10);
  await db.users.create({ email, name, passwordHash, role, createdAt: new Date().toISOString() });
  console.log(`Created ${role}: ${email} / ${password}`);
}

async function main() {
  await upsertUser({ name: 'Shop Staff', email: 'staff@campusprint.demo', password: 'staff123', role: 'staff' });
  await upsertUser({ name: 'Demo Student', email: 'student@campusprint.demo', password: 'student123', role: 'student' });
  console.log('Seed complete. Login with these credentials on the frontend.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
