import express from 'express';
import { bookTicket, setCurrentUser } from './interfaces/booking.controller.js';
import { login } from './interfaces/auth.controller.js';

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