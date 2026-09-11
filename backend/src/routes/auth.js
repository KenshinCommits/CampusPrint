import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/index.js';
import { config } from '../config.js';
import { requireAuth } from '../middleware/auth.js';

export const authRouter = Router();

authRouter.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'name, email and password are required' });
    }
    const cleanRole = role === 'staff' ? 'staff' : 'student';
    const existing = await db.users.findByEmail(email.toLowerCase());
    if (existing) return res.status(409).json({ error: 'An account with this email already exists' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = {
      email: email.toLowerCase(),
      name,
      passwordHash,
      role: cleanRole,
      createdAt: new Date().toISOString(),
    };
    await db.users.create(user);

    const token = signToken(user);
    res.status(201).json({ token, user: publicUser(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Signup failed' });
  }
});

authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password are required' });

    const user = await db.users.findByEmail(email.toLowerCase());
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid email or password' });

    const token = signToken(user);
    res.json({ token, user: publicUser(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

authRouter.get('/me', requireAuth, async (req, res) => {
  const user = await db.users.findByEmail(req.user.email);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user: publicUser(user) });
});

function signToken(user) {
  return jwt.sign({ email: user.email, name: user.name, role: user.role }, config.jwtSecret, {
    expiresIn: '7d',
  });
}

function publicUser(user) {
  const { passwordHash, ...rest } = user;
  return rest;
}
