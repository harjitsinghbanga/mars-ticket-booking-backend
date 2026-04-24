import { MongoBookingRepository } from './MongoBookingRepository';
import { Booking } from '../../domain/entities/Booking';
import mongoose from 'mongoose';

jest.mock('mongoose', () => ({
  Schema: jest.fn(),
  model: jest.fn(),
}));

describe('MongoBookingRepository', () => {
  let repository: MongoBookingRepository;
  let mockModel: any;

  beforeEach(() => {
    mockModel = {
      save: jest.fn(),
      findById: jest.fn(),
      find: jest.fn(),
      findByIdAndUpdate: jest.fn(),
    };
    (mongoose.model as jest.Mock).mockReturnValue(mockModel);
    repository = new MongoBookingRepository();
  });

  it('should create a booking', async () => {
    const booking = new Booking(
      undefined,
      'user-1',
      'Mars',
      new Date('2024-12-01'),
      undefined,
      'John Doe',
      'A1'
    );

    const savedDoc = {
      _id: { toString: () => 'booking-1' },
      userId: 'user-1',
      destination: 'Mars',
      departureDate: new Date('2024-12-01'),
      passengerName: 'John Doe',
      seatNumber: 'A1',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockModel.save.mockResolvedValue(savedDoc);

    const result = await repository.create(booking);

    expect(result.id).toBe('booking-1');
    expect(result.userId).toBe('user-1');
  });

  it('should find booking by id', async () => {
    const savedDoc = {
      _id: { toString: () => 'booking-1' },
      userId: 'user-1',
      destination: 'Mars',
      departureDate: new Date('2024-12-01'),
      passengerName: 'John Doe',
      seatNumber: 'A1',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockModel.findById.mockResolvedValue(savedDoc);

    const result = await repository.findById('booking-1');

    expect(result?.id).toBe('booking-1');
  });

  it('should return null if booking not found by id', async () => {
    mockModel.findById.mockResolvedValue(null);

    const result = await repository.findById('999');

    expect(result).toBeNull();
  });

  it('should find bookings by user id', async () => {
    const savedDocs = [
      {
        _id: { toString: () => 'booking-1' },
        userId: 'user-1',
        destination: 'Mars',
        departureDate: new Date('2024-12-01'),
        passengerName: 'John Doe',
        seatNumber: 'A1',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    mockModel.find.mockResolvedValue(savedDocs);

    const result = await repository.findByUserId('user-1');

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('booking-1');
  });

  it('should update booking status', async () => {
    const updatedDoc = {
      _id: { toString: () => 'booking-1' },
      userId: 'user-1',
      destination: 'Mars',
      departureDate: new Date('2024-12-01'),
      passengerName: 'John Doe',
      seatNumber: 'A1',
      status: 'confirmed',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockModel.findByIdAndUpdate.mockResolvedValue(updatedDoc);

    const result = await repository.updateStatus('booking-1', 'confirmed');

    expect(result?.status).toBe('confirmed');
  });

  it('should return null if update fails', async () => {
    mockModel.findByIdAndUpdate.mockResolvedValue(null);

    const result = await repository.updateStatus('999', 'confirmed');

    expect(result).toBeNull();
  });

  it('should find all bookings', async () => {
    const savedDocs = [
      {
        _id: { toString: () => 'booking-1' },
        userId: 'user-1',
        destination: 'Mars',
        departureDate: new Date('2024-12-01'),
        passengerName: 'John Doe',
        seatNumber: 'A1',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    mockModel.find.mockResolvedValue(savedDocs);

    const result = await repository.findAll();

    expect(result).toHaveLength(1);
  });
});import mongoose from 'mongoose';
import { MongoBookingRepository } from './MongoBookingRepository';
import { Booking } from '../../domain/entities/Booking';

describe('MongoBookingRepository', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create a booking document', async () => {
    const saveSpy = jest.spyOn(mongoose.Model.prototype as any, 'save').mockResolvedValue({
      id: 'booking-1',
      userId: 'user-1',
      destination: 'Mars',
      departureDate: new Date('2026-05-01'),
      passengerName: 'Eve',
      seatNumber: 'A1',
      status: 'pending',
    } as any);

    const repository = new MongoBookingRepository();
    const booking = new Booking(
      undefined,
      'user-1',
      'Mars',
      new Date('2026-05-01'),
      undefined,
      'Eve',
      'A1',
      'pending'
    );

    const result = await repository.create(booking);

    expect(saveSpy).toHaveBeenCalled();
    expect(result).toHaveProperty('id', 'booking-1');
  });

  it('should find a booking by id', async () => {
    const booking = {
      id: 'booking-1',
      userId: 'user-1',
      destination: 'Mars',
      departureDate: new Date('2026-05-01'),
      returnDate: undefined,
      passengerName: 'Eve',
      seatNumber: 'A1',
      status: 'pending',
      createdAt: new Date('2026-05-01'),
      updatedAt: new Date('2026-05-01'),
    };
    const BookingModel = mongoose.model('Booking');
    const findOneSpy = jest.spyOn(BookingModel, 'findOne' as any).mockReturnValue({ lean: () => Promise.resolve(booking) } as any);

    const repository = new MongoBookingRepository();
    const result = await repository.findById('booking-1');

    expect(findOneSpy).toHaveBeenCalledWith({ id: 'booking-1' });
    expect(result).toEqual(booking);
  });

  it('should find all bookings', async () => {
    const bookings = [
      {
        id: 'booking-1',
        userId: 'user-1',
        destination: 'Mars',
        departureDate: new Date('2026-05-01'),
        returnDate: undefined,
        passengerName: 'Eve',
        seatNumber: 'A1',
        status: 'pending',
        createdAt: new Date('2026-05-01'),
        updatedAt: new Date('2026-05-01'),
      },
    ];
    const BookingModel = mongoose.model('Booking');
    jest.spyOn(BookingModel, 'find' as any).mockReturnValue({ lean: () => Promise.resolve(bookings) } as any);

    const repository = new MongoBookingRepository();
    const result = await repository.findAll();

    expect(result).toEqual(bookings);
  });

  it('should update booking status when booking exists', async () => {
    const updatedBooking = {
      id: 'booking-1',
      status: 'confirmed',
      updatedAt: new Date(),
    };
    const BookingModel = mongoose.model('Booking');
    const findOneAndUpdateSpy = jest.spyOn(BookingModel, 'findOneAndUpdate' as any).mockReturnValue({ lean: () => Promise.resolve(updatedBooking) } as any);

    const repository = new MongoBookingRepository();
    const result = await repository.updateStatus('booking-1', 'confirmed');

    expect(findOneAndUpdateSpy).toHaveBeenCalledWith(
      { id: 'booking-1' },
      { status: 'confirmed', updatedAt: expect.any(Date) },
      { new: true }
    );
    expect(result).toEqual(updatedBooking);
  });

  it('should return null when updateStatus cannot find booking', async () => {
    const BookingModel = mongoose.model('Booking');
    jest.spyOn(BookingModel, 'findOneAndUpdate' as any).mockReturnValue({ lean: () => Promise.resolve(null) } as any);

    const repository = new MongoBookingRepository();
    const result = await repository.updateStatus('missing', 'cancelled');

    expect(result).toBeNull();
  });
});
