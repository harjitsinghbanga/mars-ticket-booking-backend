import { Request, Response } from 'express';
import { CreateBooking } from '../../application/use-cases/CreateBooking';
import { UpdateBookingStatus } from '../../application/use-cases/UpdateBookingStatus';
import { BookingRepository } from '../../domain/repositories/BookingRepository';
import { Booking } from '../../domain/entities/Booking';

export class BookingController {
  constructor(
    private createBookingUseCase: CreateBooking,
    private updateBookingStatus: UpdateBookingStatus,
    private bookingRepository: BookingRepository
  ) {}

  private serializeBooking(booking: Booking) {
    return {
      bookingId: booking.id,
      userId: booking.userId,
      destination: booking.destination,
      departureDate: booking.departureDate,
      returnDate: booking.returnDate,
      passengerName: booking.passengerName,
      seatNumber: booking.seatNumber,
      status: booking.status,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    };
  }

  async createBooking(req: Request, res: Response): Promise<void> {
    try {
      const { destination, departureDate, returnDate, passengerName, seatNumber } = req.body;
      const userId = req.user!.userId;

      const booking = await this.createBookingUseCase.execute({
        userId,
        destination,
        departureDate: new Date(departureDate),
        returnDate: returnDate ? new Date(returnDate) : undefined,
        passengerName,
        seatNumber,
      });

      res.status(201).json(this.serializeBooking(booking));
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async getUserBookings(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const bookings = await this.bookingRepository.findByUserId(userId);
      res.json(bookings.map(booking => this.serializeBooking(booking)));
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async updateStatus(req: Request, res: Response): Promise<void> {
    try {
      const bookingId = String(req.params.bookingId);
      const status = req.body.status;
      const userRole = req.user!.role;

      if (!status || typeof status !== 'string') {
        res.status(400).json({ error: 'Status is required' });
        return;
      }

      const normalizedStatus = status.toLowerCase();
      const validStatuses = ['pending', 'confirmed', 'cancelled', 'decline'] as const;
      if (!validStatuses.includes(normalizedStatus as any)) {
        res.status(400).json({ error: 'Invalid booking status' });
        return;
      }

      if (String(userRole).toLowerCase() !== 'admin') {
        res.status(403).json({ error: 'Only admins can update booking status' });
        return;
      }

      const booking = await this.updateBookingStatus.execute(bookingId, normalizedStatus as 'pending' | 'confirmed' | 'cancelled' | 'decline');
      if (!booking) {
        res.status(404).json({ error: 'Booking not found' });
        return;
      }

      res.json(this.serializeBooking(booking));
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async getAllBookings(req: Request, res: Response): Promise<void> {
    try {
      const bookings = await this.bookingRepository.findAll();
      res.json(bookings.map(booking => this.serializeBooking(booking)));
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}