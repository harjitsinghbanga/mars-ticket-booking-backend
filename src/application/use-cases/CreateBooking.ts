import { Booking } from '../../domain/entities/Booking';
import { BookingRepository } from '../../domain/repositories/BookingRepository';

export class CreateBooking {
  constructor(private bookingRepository: BookingRepository) {}

  async execute(bookingData: Booking): Promise<Booking> {
    if (new Date(bookingData.launchDate) < new Date()) {
      throw new Error('Launch date cannot be in the past.');
    }
    
    bookingData.status = 'Pending';
    bookingData.createdAt = new Date();

    return await this.bookingRepository.create(bookingData);
  }
}