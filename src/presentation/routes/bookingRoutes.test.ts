import request from 'supertest';
import express from 'express';
import bookingRoutes from './bookingRoutes';
import { MongoBookingRepository } from '../../infrastructure/database/MongoBookingRepository';
import { CreateBooking } from '../../application/use-cases/CreateBooking';
import { UpdateBookingStatus } from '../../application/use-cases/UpdateBookingStatus';
import { BookingController } from '../controllers/BookingController';

// Mock the repository and use cases
jest.mock('../../../infrastructure/database/MongoBookingRepository');
jest.mock('../../../application/use-cases/CreateBooking');
jest.mock('../../../application/use-cases/UpdateBookingStatus');

describe('Booking Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    // Mock authentication middleware
    app.use('/api/bookings', (req, res, next) => {
      req.user = { userId: 'user-1', role: 'Customer' };
      next();
    });

    app.use('/api/bookings', bookingRoutes);
  });

  it('should have POST route for creating bookings', async () => {
    const response = await request(app)
      .post('/api/bookings')
      .send({
        destination: 'Mars',
        departureDate: '2024-12-01',
        passengerName: 'John Doe',
        seatNumber: 'A1',
      });

    expect(response.status).toBe(201);
  });

  it('should have GET route for user bookings', async () => {
    const response = await request(app).get('/api/bookings');

    expect(response.status).toBe(200);
  });

  it('should have PATCH route for updating status', async () => {
    // Mock admin user
    app.use('/api/bookings/:bookingId', (req, res, next) => {
      req.user = { userId: 'admin-1', role: 'Admin' };
      next();
    });

    const response = await request(app)
      .patch('/api/bookings/booking-1')
      .send({ status: 'confirmed' });

    expect(response.status).toBe(200);
  });
});


describe('Booking Routes', () => {
  it('should expose booking route configuration', () => {
    expect(bookingRoutes).toBeDefined();
  });

});