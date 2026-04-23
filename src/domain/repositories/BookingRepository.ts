import { Booking } from '../entities/Booking';

export interface BookingRepository {
  create(booking: Booking): Promise<Booking>;
  findById(id: string): Promise<Booking | null>;
  findByUserId(userId: string): Promise<Booking[]>;
  updateStatus(id: string, status: 'pending' | 'confirmed' | 'cancelled' | 'decline'): Promise<Booking | null>;
  findAll(): Promise<Booking[]>;
}