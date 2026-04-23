import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './infrastructure/database/mongodb';
import { getBookingRepository, getUserRepository, getAuthorRepository, setUseMongoDB } from './infrastructure/database/repositoryFactory';
import { createUserRouter } from './presentation/routes/userRoutes';
import { createBookingRouter } from './presentation/routes/bookingRoutes';
import { createAuthorRouter } from './presentation/routes/authorRoutes';
import { createAdminRouter } from './presentation/routes/adminRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Mars Ticket Booking Is Online NOW',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      users: '/api/users',
      auth: '/api/auth',
      admin: '/api/admin',
      authors: '/api/authors',
      bookings: '/api/bookings',
    },
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const startServer = async () => {
  let databaseMessage = 'Using in-memory repository';

  try {
    await connectDB();
    setUseMongoDB(true);
    databaseMessage = 'MongoDB connected';
  } catch (error) {
    setUseMongoDB(false);
    console.warn('MongoDB connection failed. Starting with in-memory repository.');
  }

  const userRepository = getUserRepository();
  const bookingRepository = getBookingRepository();
  const authorRepository = getAuthorRepository();

  const userRouter = createUserRouter(userRepository);
  const authorRouter = createAuthorRouter(authorRepository);
  const adminRouter = createAdminRouter(userRepository);

  app.use('/api/users', userRouter);
  app.use('/api/auth', userRouter);
  app.use('/api/admin', adminRouter);
  app.use('/api/authors', authorRouter);
  app.use('/api/bookings', createBookingRouter(bookingRepository));

  app.listen(PORT, () => {
    console.log(databaseMessage);
    console.log(`Server running at http://localhost:${PORT}`);
  });
};

startServer();

export default app;