import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { authRouter } from './routes/auth.js';
import { ordersRouter } from './routes/orders.js';
import { staffRouter } from './routes/staff.js';

const app = express();

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());

app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/api/auth', authRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/staff', staffRouter);

// Central error handler (e.g. Multer file-size errors land here)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

app.listen(config.port, () => {
  console.log(`API running on port ${config.port}`);
});
