require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./src/db');

async function seedUser({ name, email, password, role }) {
  const existing = await db.getUserByEmail(email);
  if (existing) {
    console.log(`Account already exists: ${email}`);
    return;
  }
  const passwordHash = await bcrypt.hash(password, 10);
  await db.createUser({
    email,
    name,
    passwordHash,
    role,
    createdAt: new Date().toISOString(),
  });
  console.log(`Seeded ${role} account -> email: ${email}  password: ${password}`);
}

async function seed() {
  await seedUser({
    name: 'Shop Staff',
    email: 'staff@campusprint.com',
    password: 'staff123',
    role: 'staff',
  });
  await seedUser({
    name: 'Shop Staff',
    email: 'staff@campusprint.demo',
    password: 'staff123',
    role: 'staff',
  });
  await seedUser({
    name: 'Demo Student',
    email: 'student@campusprint.demo',
    password: 'student123',
    role: 'student',
  });
  await seedUser({
    name: 'Demo Student',
    email: 'student@campusprint.com',
    password: 'student123',
    role: 'student',
  });
}

seed();
