import { Booking } from '../entities/Booking';

export interface BookingRepository {
  create(booking: Booking): Promise<Booking>;
  findById(id: string): Promise<Booking | null>;
  findAll(): Promise<Booking[]>;
  updateStatus(id: string, status: 'Pending' | 'Confirmed' | 'Declined'): Promise<Booking | null>;
}