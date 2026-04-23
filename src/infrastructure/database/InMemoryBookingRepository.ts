import { Booking } from '../../domain/entities/Booking';
import { BookingRepository } from '../../domain/repositories/BookingRepository';

export class InMemoryBookingRepository implements BookingRepository {
  private bookings: Booking[] = [];

  async create(booking: Booking): Promise<Booking> {
    const newBooking = new Booking(
      booking.id || `booking-${Date.now()}`,
      booking.userId,
      booking.destination,
      booking.departureDate,
      booking.returnDate,
      booking.passengerName,
      booking.seatNumber,
      booking.status,
      booking.createdAt || new Date(),
      booking.updatedAt || new Date()
    );
    this.bookings.push(newBooking);
    return newBooking;
  }

  async findById(id: string): Promise<Booking | null> {
    return this.bookings.find(booking => booking.id === id) || null;
  }

  async findByUserId(userId: string): Promise<Booking[]> {
    return this.bookings.filter(booking => booking.userId === userId);
  }

  async updateStatus(id: string, status: 'pending' | 'confirmed' | 'cancelled' | 'decline'): Promise<Booking | null> {
    const booking = this.bookings.find(b => b.id === id);
    if (!booking) return null;
    booking.status = status;
    booking.updatedAt = new Date();
    return booking;
  }

  async findAll(): Promise<Booking[]> {
    return [...this.bookings];
  }
}import { BookingRepository } from '../../domain/repositories/BookingRepository';
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