import request from 'supertest';
import express from 'express';
import userRoutes from './userRoutes';

describe('User Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/users', userRoutes);
  });

  it('should have POST route for user registration', async () => {
    const response = await request(app)
      .post('/api/users/register')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(201);
  });

  it('should have POST route for user login', async () => {
    const response = await request(app)
      .post('/api/users/login')
      .send({
        email: 'john@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(200);
  });
});