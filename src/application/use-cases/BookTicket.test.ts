import { BookTicket } from './BookTicket';
import { InMemoryBookingRepository } from '../../infrastructure/database/InMemoryBookingRepository';

describe('BookTicket', () => {
  let bookTicket: BookTicket;
  let bookingRepository: InMemoryBookingRepository;

  beforeEach(() => {
    bookingRepository = new InMemoryBookingRepository();
    bookTicket = new BookTicket(bookingRepository);
  });

  it('should create a booking successfully', async () => {
    const bookingData = {
      userId: 'user-1',
      destination: 'Mars',
      departureDate: new Date('2024-12-01'),
      passengerName: 'John Doe',
      seatNumber: 'A1',
    };

    const booking = await bookTicket.execute(bookingData);

    expect(booking).toBeDefined();
    expect(booking.userId).toBe(bookingData.userId);
    expect(booking.destination).toBe(bookingData.destination);
    expect(booking.passengerName).toBe(bookingData.passengerName);
    expect(booking.seatNumber).toBe(bookingData.seatNumber);
    expect(booking.status).toBe('pending');
  });

  it('should create a booking with return date', async () => {
    const bookingData = {
      userId: 'user-1',
      destination: 'Mars',
      departureDate: new Date('2024-12-01'),
      returnDate: new Date('2024-12-15'),
      passengerName: 'Jane Doe',
      seatNumber: 'B2',
    };

    const booking = await bookTicket.execute(bookingData);

    expect(booking.returnDate).toEqual(bookingData.returnDate);
  });
});
