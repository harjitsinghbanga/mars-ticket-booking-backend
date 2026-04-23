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
});