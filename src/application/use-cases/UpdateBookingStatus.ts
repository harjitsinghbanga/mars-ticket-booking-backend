import { Booking } from '../../domain/entities/Booking';
import { BookingRepository } from '../../domain/repositories/BookingRepository';

export class UpdateBookingStatus {
  constructor(private bookingRepository: BookingRepository) {}

  async execute(id: string, status: 'pending' | 'confirmed' | 'cancelled' | 'decline'): Promise<Booking | null> {
    return await this.bookingRepository.updateStatus(id, status);
  }
}
// update
