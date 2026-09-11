import jwt from 'jsonwebtoken';
import { config } from '../config.js';

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  // Also accept ?token=... so plain <a href> download links (e.g. the staff
  // "view file" link) can authenticate without JS-driven fetch+blob juggling.
  const token = header.startsWith('Bearer ') ? header.slice(7) : req.query.token || null;
  if (!token) return res.status(401).json({ error: 'Missing auth token' });

  try {
    const payload = jwt.verify(token, config.jwtSecret);
    req.user = payload; // { email, name, role }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ error: `Requires ${role} role` });
    }
    next();
  };
}
