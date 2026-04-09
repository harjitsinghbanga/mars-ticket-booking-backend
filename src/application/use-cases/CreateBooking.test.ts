import { CreateBooking } from './CreateBooking';
import { Booking } from '../../domain/entities/Booking';
import { BookingRepository } from '../../domain/repositories/BookingRepository';

class MockBookingRepository implements BookingRepository {
  async create(booking: Booking): Promise<Booking> {
    return { ...booking, id: 'mars-ticket-999' };
  }
  async findById(id: string): Promise<Booking | null> { return null; }
  async findAll(): Promise<Booking[]> { return []; }
  async updateStatus(id: string, status: any): Promise<Booking | null> { return null; }
}

describe('CreateBooking Use Case', () => {
  let createBooking: CreateBooking;
  let mockRepo: MockBookingRepository;

  beforeEach(() => {
    mockRepo = new MockBookingRepository();
    createBooking = new CreateBooking(mockRepo);
  });

  it('should successfully create a new booking if the date is in the future', async () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);

    const newTicket: Booking = {
      userId: 'user_123',
      launchDate: futureDate,
      seatClass: 'Economy',
      status: 'Pending'
    };

    const result = await createBooking.execute(newTicket);

    expect(result.id).toBe('mars-ticket-999'); 
    expect(result.status).toBe('Pending');     
  });

  it('should throw an error if the launch date is in the past', async () => {
    const pastDate = new Date('2020-01-01');

    const badTicket: Booking = {
      userId: 'user_123',
      launchDate: pastDate,
      seatClass: 'VIP-Pod',
      status: 'Pending'
    };

    await expect(createBooking.execute(badTicket)).rejects.toThrow('Launch date cannot be in the past.');
  });
});