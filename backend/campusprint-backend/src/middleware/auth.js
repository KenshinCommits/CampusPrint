const jwt = require('jsonwebtoken');

// Checks the Authorization: Bearer <token> header and attaches req.user
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { email, role, name }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// Use after requireAuth to lock a route to staff only
function requireStaff(req, res, next) {
  if (req.user.role !== 'staff') {
    return res.status(403).json({ error: 'Staff only' });
  }
  next();
}

module.exports = { requireAuth, requireStaff };
