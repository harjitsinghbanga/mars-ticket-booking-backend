import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bookingRoutes from './presentation/routes/bookingRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/bookings', bookingRoutes);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Mars Ticket Booking API is running! 🚀' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});