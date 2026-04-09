import { Request, Response } from 'express';
import { CreateBooking } from '../../application/use-cases/CreateBooking';

export class BookingController {
  constructor(private createBookingUseCase: CreateBooking) {}

  async createBooking(req: Request, res: Response) {
    try {
      const bookingData = req.body;
      const result = await this.createBookingUseCase.execute(bookingData);
      res.status(201).json({ message: 'Mars Ticket booked successfully!', ticket: result });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}