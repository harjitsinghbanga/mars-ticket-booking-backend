import express from 'express';
import { bookTicket, setCurrentUser, repo, getCurrentUser } from './interfaces/booking.controller.js';
import { login } from './interfaces/auth.controller.js';

const logger = {
  info: (msg: string) => console.log(`[INFO] ${new Date().toISOString()} - ${msg}`),
  error: (msg: string) => console.error(`[ERROR] ${new Date().toISOString()} - ${msg}`),
  warn: (msg: string) => console.warn(`[WARN] ${new Date().toISOString()} - ${msg}`)
};

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Mars Ticket Booking Backend is running! 🚀');
});

app.post('/login', login);

// Simple test route to logout / switch to guest
app.post('/logout', (req, res) => {
  setCurrentUser(null);
  res.send('Logged out - now guest mode');
});

// Simple test route to login as admin (for testing)
app.post('/login-admin', (req, res) => {
  setCurrentUser({ id: 1, isAdmin: true });
  res.send('Logged in as admin');
});

app.post('/book', bookTicket);

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
// Admin approve/decline (only if user.isAdmin)
app.post('/admin/approve', (req, res) => {
  const user = getCurrentUser();
  if (!user || !user.isAdmin) return res.status(403).send('Admin only');
  const { pendingId } = req.body;
  const pending = repo.getPendingById(pendingId);
  if (!pending || pending.status !== 'pending') return res.status(400).send('Invalid pending ID');
  
  repo.updatePendingStatus(pendingId, 'approved');
  repo.reduceSeats(pending.launchId);
  logger.info(`Admin approved pending ${pendingId}`);
  res.send('Approved');
});

app.post('/admin/decline', (req, res) => {
  const user = getCurrentUser();
  if (!user || !user.isAdmin) return res.status(403).send('Admin only');
  const { pendingId } = req.body;
  const pending = repo.getPendingById(pendingId);
  if (!pending || pending.status !== 'pending') return res.status(400).send('Invalid pending ID');
  
  repo.updatePendingStatus(pendingId, 'declined');
  logger.info(`Admin declined pending ${pendingId}`);
  res.send('Declined');
});