import { BookingRepository } from '../../domain/repositories/BookingRepository';
import { Booking } from '../../domain/entities/Booking';

export class InMemoryBookingRepository implements BookingRepository {
  private bookings: Booking[] = [];

  async create(booking: Booking): Promise<Booking> {
    const newBooking = { ...booking, id: `mars-${Math.floor(Math.random() * 10000)}` };
    this.bookings.push(newBooking);
    return newBooking;
  }

  async findById(id: string): Promise<Booking | null> { return null; }
  async findAll(): Promise<Booking[]> { return []; }
  async updateStatus(id: string, status: any): Promise<Booking | null> { return null; }
}