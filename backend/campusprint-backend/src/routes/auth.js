const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

function signToken(user) {
  return jwt.sign(
    { email: user.email, name: user.name, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '12h' }
  );
}

router.post('/signup', async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'name, email, password, role are all required' });
  }
  if (!['student', 'staff'].includes(role)) {
    return res.status(400).json({ error: "role must be 'student' or 'staff'" });
  }
  if (await db.getUserByEmail(email)) {
    return res.status(409).json({ error: 'An account with this email already exists' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await db.createUser({
    email,
    name,
    passwordHash,
    role,
    createdAt: new Date().toISOString(),
  });

  const token = signToken(user);
  res.status(201).json({ token, user: { email: user.email, name: user.name, role: user.role } });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await db.getUserByEmail(email);
  if (!user) return res.status(401).json({ error: 'Invalid email or password' });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid email or password' });

  const token = signToken(user);
  res.json({ token, user: { email: user.email, name: user.name, role: user.role } });
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
