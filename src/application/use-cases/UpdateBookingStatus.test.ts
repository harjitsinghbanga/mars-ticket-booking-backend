import { UpdateBookingStatus } from './UpdateBookingStatus';
import { InMemoryBookingRepository } from '../../infrastructure/database/InMemoryBookingRepository';
import { Booking } from '../../domain/entities/Booking';

describe('UpdateBookingStatus', () => {
  let updateBookingStatus: UpdateBookingStatus;
  let bookingRepository: InMemoryBookingRepository;

  beforeEach(() => {
    bookingRepository = new InMemoryBookingRepository();
    updateBookingStatus = new UpdateBookingStatus(bookingRepository);
  });

  it('should update booking status to confirmed', async () => {
    // Create a booking first
    const booking = new Booking(
      undefined,
      'user-1',
      'Mars',
      new Date('2024-12-01'),
      undefined,
      'John Doe',
      'A1',
      'pending'
    );

    const created = await bookingRepository.create(booking);

    // Update status
    const updated = await updateBookingStatus.execute(created.id!, 'confirmed');

    expect(updated?.status).toBe('confirmed');
  });

  it('should update booking status to cancelled', async () => {
    const booking = new Booking(
      undefined,
      'user-1',
      'Mars',
      new Date('2024-12-01'),
      undefined,
      'Jane Doe',
      'B2',
      'pending'
    );

    const created = await bookingRepository.create(booking);
    const updated = await updateBookingStatus.execute(created.id!, 'cancelled');

    expect(updated?.status).toBe('cancelled');
  });

  it('should return null for nonexistent booking', async () => {
    const result = await updateBookingStatus.execute('nonexistent-id', 'confirmed');
    expect(result).toBeNull();
  });

  it('should update to decline status', async () => {
    const booking = new Booking(
      undefined,
      'user-1',
      'Mars',
      new Date('2024-12-01'),
      undefined,
      'Bob Smith',
      'C3',
      'pending'
    );

    const created = await bookingRepository.create(booking);
    const updated = await updateBookingStatus.execute(created.id!, 'decline');

    expect(updated?.status).toBe('decline');
  });
});
