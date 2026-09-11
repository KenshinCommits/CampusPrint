require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./src/routes/auth');
const orderRoutes = require('./src/routes/orders');
const staffRoutes = require('./src/routes/staff');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/staff', staffRoutes);

// Catch-all error handler so a bug never just hangs the demo silently
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Something went wrong' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`CampusPrint backend running on http://localhost:${PORT}`);
});
