import { BookingController } from './BookingController';
import { CreateBooking } from '../../application/use-cases/CreateBooking';
import { UpdateBookingStatus } from '../../application/use-cases/UpdateBookingStatus';
import { InMemoryBookingRepository } from '../../infrastructure/database/InMemoryBookingRepository';

describe('BookingController', () => {
  let controller: BookingController;
  let repository: InMemoryBookingRepository;
  let createBooking: CreateBooking;
  let updateBookingStatus: UpdateBookingStatus;

  beforeEach(() => {
    repository = new InMemoryBookingRepository();
    createBooking = new CreateBooking(repository);
    updateBookingStatus = new UpdateBookingStatus(repository);
    controller = new BookingController(createBooking, updateBookingStatus, repository);
  });

  it('should create booking successfully', async () => {
    const mockReq = {
      body: {
        destination: 'Mars',
        departureDate: '2024-12-01',
        passengerName: 'John Doe',
        seatNumber: 'A1',
      },
      user: { userId: 'user-1', role: 'Customer' },
    } as any;

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    await controller.createBooking(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalled();
  });

  it('should handle create booking error', async () => {
    const mockReq = {
      body: {
        destination: 'Mars',
        departureDate: '2024-12-01',
        passengerName: 'Duplicate',
        seatNumber: 'A1',
      },
      user: { userId: 'user-1', role: 'Customer' },
    } as any;

    // Create a duplicate first
    await repository.create({
      id: 'booking-1',
      userId: 'user-1',
      destination: 'Mars',
      departureDate: new Date('2024-12-01'),
      passengerName: 'Duplicate',
      seatNumber: 'A1',
      status: 'pending',
    } as any);

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    await controller.createBooking(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: expect.stringContaining('already exists') });
  });

  it('should update status for admin', async () => {
    await repository.create({
      id: 'booking-1',
      userId: 'user-1',
      destination: 'Mars',
      departureDate: new Date('2024-12-01'),
      passengerName: 'John Doe',
      seatNumber: 'A1',
      status: 'pending',
    } as any);

    const mockReq = {
      params: { bookingId: 'booking-1' },
      body: { status: 'confirmed' },
      user: { userId: 'admin-1', role: 'Admin' },
    } as any;

    const mockRes = {
      json: jest.fn(),
    } as any;

    await controller.updateStatus(mockReq, mockRes);

    expect(mockRes.json).toHaveBeenCalled();
  });

  it('should deny status update for non-admin', async () => {
    const mockReq = {
      params: { bookingId: 'booking-1' },
      body: { status: 'confirmed' },
      user: { userId: 'user-1', role: 'Customer' },
    } as any;

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    await controller.updateStatus(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Only admins can update booking status' });
  });

  it('should return 400 for invalid status type', async () => {
    const mockReq = {
      params: { bookingId: 'booking-1' },
      body: { status: 123 },
      user: { userId: 'admin-1', role: 'Admin' },
    } as any;

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    await controller.updateStatus(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Status is required' });
  });

  it('should return 400 for invalid status', async () => {
    const mockReq = {
      params: { bookingId: 'booking-1' },
      body: { status: 'invalid' },
      user: { userId: 'admin-1', role: 'Admin' },
    } as any;

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    await controller.updateStatus(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Invalid booking status' });
  });

  it('should return 404 for non-existent booking', async () => {
    const mockReq = {
      params: { bookingId: 'non-existent' },
      body: { status: 'confirmed' },
      user: { userId: 'admin-1', role: 'Admin' },
    } as any;

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    await controller.updateStatus(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Booking not found' });
  });

  it('should get user bookings', async () => {
    await repository.create({
      id: 'booking-1',
      userId: 'user-1',
      destination: 'Mars',
      departureDate: new Date('2024-12-01'),
      passengerName: 'John Doe',
      seatNumber: 'A1',
      status: 'pending',
    } as any);

    const mockReq = {
      user: { userId: 'user-1', role: 'Customer' },
    } as any;

    const mockRes = {
      json: jest.fn(),
    } as any;

    await controller.getUserBookings(mockReq, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith([
      expect.objectContaining({
        bookingId: 'booking-1',
        userId: 'user-1',
        destination: 'Mars',
      }),
    ]);
  });

  it('should get all bookings', async () => {
    await repository.create({
      id: 'booking-1',
      userId: 'user-1',
      destination: 'Mars',
      departureDate: new Date('2024-12-01'),
      passengerName: 'John Doe',
      seatNumber: 'A1',
      status: 'pending',
    } as any);

    const mockReq = {} as any;

    const mockRes = {
      json: jest.fn(),
    } as any;

    await controller.getAllBookings(mockReq, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith([
      expect.objectContaining({
        bookingId: 'booking-1',
      }),
    ]);
  });

  it('should handle update status error', async () => {
    // Mock updateBookingStatus to throw
    jest.spyOn(updateBookingStatus, 'execute').mockRejectedValue(new Error('Update failed'));

    const mockReq = {
      params: { bookingId: 'booking-1' },
      body: { status: 'confirmed' },
      user: { userId: 'admin-1', role: 'Admin' },
    } as any;

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    await controller.updateStatus(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Update failed' });
  });
});