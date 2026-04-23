import { InMemoryBookingRepository } from './InMemoryBookingRepository';
import { Booking } from '../../domain/entities/Booking';

describe('InMemoryBookingRepository', () => {
  let repository: InMemoryBookingRepository;

  beforeEach(() => {
    repository = new InMemoryBookingRepository();
  });

  it('should create and find a booking', async () => {
    const booking = new Booking(
      'booking-1',
      'user-1',
      'Mars',
      new Date('2024-12-01'),
      undefined,
      'John Doe',
      'A1'
    );

    const created = await repository.create(booking);
    const found = await repository.findById('booking-1');

    expect(created.id).toBe('booking-1');
    expect(found).toBeDefined();
    expect(found!.id).toBe('booking-1');
  });

  it('should find bookings by user ID', async () => {
    const booking1 = new Booking(
      'booking-1',
      'user-1',
      'Mars',
      new Date('2024-12-01'),
      undefined,
      'John Doe',
      'A1'
    );
    const booking2 = new Booking(
      'booking-2',
      'user-1',
      'Venus',
      new Date('2024-12-15'),
      undefined,
      'Jane Doe',
      'B2'
    );

    await repository.create(booking1);
    await repository.create(booking2);

    const userBookings = await repository.findByUserId('user-1');

    expect(userBookings).toHaveLength(2);
    expect(userBookings.map(b => b.id)).toEqual(['booking-1', 'booking-2']);
  });

  it('should update booking status', async () => {
    const booking = new Booking(
      'booking-1',
      'user-1',
      'Mars',
      new Date('2024-12-01'),
      undefined,
      'John Doe',
      'A1'
    );

    await repository.create(booking);
    const updated = await repository.updateStatus('booking-1', 'confirmed');

    expect(updated!.status).toBe('confirmed');
  });
});