import request from 'supertest';
import express from 'express';
import { createBookingRouter } from './bookingRoutes';
import { InMemoryBookingRepository } from '../../infrastructure/database/InMemoryBookingRepository';
import jwt from 'jsonwebtoken';

describe('Booking Routes', () => {
  let app: express.Application;
  let bookingRepository: InMemoryBookingRepository;
  let token: string;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    bookingRepository = new InMemoryBookingRepository();
    token = jwt.sign({ userId: 'user-1', role: 'Customer' }, process.env.JWT_SECRET || 'your-secret-key');

    app.use('/api/bookings', createBookingRouter(bookingRepository));
  });

  it('should have POST route for creating bookings', async () => {
    const response = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${token}`)
      .send({
        destination: 'Mars',
        departureDate: new Date('2024-12-01').toISOString(),
        passengerName: 'John Doe',
        seatNumber: 'A1',
      });

    expect(response.status).toBe(201);
    expect(response.body.bookingId).toBeDefined();
  });

  it('should have GET route for user bookings', async () => {
    const response = await request(app)
      .get('/api/bookings')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
  });

  it('should deny booking status update for non-admin', async () => {
    const response = await request(app)
      .patch('/api/bookings/booking-1')
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'confirmed' });

    expect(response.status).toBe(403);
  });

  it('should allow booking status update for admin', async () => {
    const adminToken = jwt.sign({ userId: 'admin-1', role: 'Admin' }, process.env.JWT_SECRET || 'your-secret-key');

    const response = await request(app)
      .patch('/api/bookings/booking-1')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'confirmed' });

    expect(response.status).toBe(404); // since booking doesn't exist
  });
});