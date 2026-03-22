import express from 'express';
import { bookTicket } from './interfaces/booking.controller.js';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Mars Ticket Booking Backend is running! 🚀');
});

app.post('/book', bookTicket);

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});