import { Router } from 'express';
import { BookingController } from '../controllers/BookingController';
import { CreateBooking } from '../../application/use-cases/CreateBooking';
import { UpdateBookingStatus } from '../../application/use-cases/UpdateBookingStatus';
import { BookingRepository } from '../../domain/repositories/BookingRepository';
import { authenticateToken } from '../middleware/authMiddleware';

export const createBookingRouter = (bookingRepository: BookingRepository) => {
  const router = Router();
  const createBooking = new CreateBooking(bookingRepository);
  const updateBookingStatus = new UpdateBookingStatus(bookingRepository);
  const bookingController = new BookingController(createBooking, updateBookingStatus, bookingRepository);

  router.post('/', authenticateToken, (req, res) => bookingController.createBooking(req, res));
  router.get('/', authenticateToken, (req, res) => bookingController.getUserBookings(req, res));
  router.patch('/:bookingId', authenticateToken, (req, res) => bookingController.updateStatus(req, res));
  router.get('/all', authenticateToken, (req, res) => bookingController.getAllBookings(req, res));

  return router;
};

export default createBookingRouter;