import { authenticateToken } from './authMiddleware';
import { Request, Response, NextFunction } from 'express';

describe('Auth Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should reject requests without authorization header', () => {
    authenticateToken(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Access token required' });
  });

  it('should reject invalid tokens', () => {
    req.headers = { authorization: 'Bearer invalid_token' };
    authenticateToken(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token' });
  });

  it('should parse valid Bearer token', () => {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ userId: 'user-1', role: 'Customer' }, process.env.JWT_SECRET || 'your-secret-key');
    req.headers = { authorization: `Bearer ${token}` };

    authenticateToken(req as Request, res as Response, next);
    expect(next).toHaveBeenCalled();
    expect((req as any).user).toEqual(expect.objectContaining({ userId: 'user-1', role: 'Customer' }));
  });
});
