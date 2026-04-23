import { CreateBooking } from './CreateBooking';
import { InMemoryBookingRepository } from '../../infrastructure/database/InMemoryBookingRepository';

describe('CreateBooking', () => {
  let createBooking: CreateBooking;
  let bookingRepository: InMemoryBookingRepository;

  beforeEach(() => {
    bookingRepository = new InMemoryBookingRepository();
    createBooking = new CreateBooking(bookingRepository);
  });

  it('should create a booking successfully', async () => {
    const bookingData = {
      userId: 'user-1',
      destination: 'Mars',
      departureDate: new Date('2024-12-01'),
      passengerName: 'John Doe',
      seatNumber: 'A1',
    };

    const booking = await createBooking.execute(bookingData);

    expect(booking).toBeDefined();
    expect(booking.userId).toBe(bookingData.userId);
    expect(booking.destination).toBe(bookingData.destination);
    expect(booking.passengerName).toBe(bookingData.passengerName);
    expect(booking.seatNumber).toBe(bookingData.seatNumber);
    expect(booking.status).toBe('pending');
  });

  it('should reject a second booking with the same token and passenger name', async () => {
    const firstBookingData = {
      userId: 'user-1',
      destination: 'Mars',
      departureDate: new Date('2024-12-01'),
      passengerName: 'John Doe',
      seatNumber: 'A1',
    };

    const secondBookingData = {
      userId: 'user-1',
      destination: 'Mars',
      departureDate: new Date('2024-12-10'),
      passengerName: 'John Doe',
      seatNumber: 'B2',
    };

    await createBooking.execute(firstBookingData);

    await expect(createBooking.execute(secondBookingData)).rejects.toThrow(
      'Booking with this passenger name already exists for the current token. Please use a different name.'
    );
  });

  it('should allow a second booking with the same token but a different passenger name', async () => {
    const firstBookingData = {
      userId: 'user-1',
      destination: 'Mars',
      departureDate: new Date('2024-12-01'),
      passengerName: 'John Doe',
      seatNumber: 'A1',
    };

    const secondBookingData = {
      userId: 'user-1',
      destination: 'Mars',
      departureDate: new Date('2024-12-10'),
      passengerName: 'Jane Doe',
      seatNumber: 'B2',
    };

    await createBooking.execute(firstBookingData);
    const secondBooking = await createBooking.execute(secondBookingData);

    expect(secondBooking).toBeDefined();
    expect(secondBooking.passengerName).toBe('Jane Doe');
  });
});