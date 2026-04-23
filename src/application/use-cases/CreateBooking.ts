import { Booking } from '../../domain/entities/Booking';
import { BookingRepository } from '../../domain/repositories/BookingRepository';

export class CreateBooking {
  constructor(private bookingRepository: BookingRepository) {}

  async execute(bookingData: {
    userId: string;
    destination: string;
    departureDate: Date;
    returnDate?: Date;
    passengerName: string;
    seatNumber: string;
  }): Promise<Booking> {
    const existingBookings = await this.bookingRepository.findByUserId(bookingData.userId);

    const duplicateBooking = existingBookings.find(
      booking => booking.passengerName.toLowerCase().trim() === bookingData.passengerName.toLowerCase().trim()
    );

    if (duplicateBooking) {
      throw new Error('Booking with this passenger name already exists for the current token. Please use a different name.');
    }

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