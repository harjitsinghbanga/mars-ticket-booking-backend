import request from 'supertest';
import express from 'express';
import { createUserRouter } from './userRoutes';
import { InMemoryUserRepository } from '../../infrastructure/database/InMemoryUserRepository';

describe('User Routes', () => {
  let app: express.Application;
  let userRepository: InMemoryUserRepository;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    userRepository = new InMemoryUserRepository();
    app.use('/api/users', createUserRouter(userRepository));
    app.use('/api/auth', createUserRouter(userRepository));
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
    expect(response.body.id).toBeDefined();
  });

  it('should have POST route for user login', async () => {
    // First register a user
    await request(app)
      .post('/api/users/register')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });

    // Then try to login
    const response = await request(app)
      .post('/api/users/login')
      .send({
        email: 'john@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  it('should reject login with wrong password', async () => {
    await request(app)
      .post('/api/users/register')
      .send({
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password123',
      });

    const response = await request(app)
      .post('/api/users/login')
      .send({
        email: 'jane@example.com',
        password: 'wrongpassword',
      });

    expect(response.status).toBe(401);
  });
});