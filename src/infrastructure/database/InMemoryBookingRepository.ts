import { BookingRepository } from '../../domain/repositories/BookingRepository';
import { Booking } from '../../domain/entities/Booking';

export class InMemoryBookingRepository implements BookingRepository {
  private bookings: Booking[] = [];

  async create(booking: Booking): Promise<Booking> {
    const newBooking = { ...booking, id: `booking-${Math.floor(Math.random() * 10000)}` };
    this.bookings.push(newBooking);
    return newBooking;
  }

  async findById(id: string): Promise<Booking | null> {
    const booking = this.bookings.find(b => b.id === id);
    return booking || null;
  }

  async findAll(): Promise<Booking[]> {
    return this.bookings;
  }

  async updateStatus(id: string, status: 'Pending' | 'Confirmed' | 'Declined'): Promise<Booking | null> {
    const booking = this.bookings.find(b => b.id === id);
    if (booking) {
      booking.status = status;
    }
    return booking || null;
  }
}