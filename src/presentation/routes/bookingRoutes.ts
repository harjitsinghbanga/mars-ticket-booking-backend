import { Router } from 'express';
import { BookingController } from '../controllers/BookingController';
import { CreateBooking } from '../../application/use-cases/CreateBooking';
import { InMemoryBookingRepository } from '../../infrastructure/database/InMemoryBookingRepository';

const router = Router();

const repository = new InMemoryBookingRepository();
const createBookingUseCase = new CreateBooking(repository);
const bookingController = new BookingController(createBookingUseCase);

router.post('/', (req, res) => bookingController.createBooking(req, res));

export default router;