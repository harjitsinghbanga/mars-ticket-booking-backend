import { Booking } from '../../domain/entities/Booking';
import { BookingRepository } from '../../domain/repositories/BookingRepository';

export class BookTicket {
  constructor(private bookingRepository: BookingRepository) {}

  async execute(bookingData: {
    userId: string;
    destination: string;
    departureDate: Date;
    returnDate?: Date;
    passengerName: string;
    seatNumber: string;
  }): Promise<Booking> {
    const booking = new Booking(
      undefined,
      bookingData.userId,
      bookingData.destination,
      bookingData.departureDate,
      bookingData.returnDate,
      bookingData.passengerName,
      bookingData.seatNumber
    );
    return await this.bookingRepository.create(booking);
  }
}