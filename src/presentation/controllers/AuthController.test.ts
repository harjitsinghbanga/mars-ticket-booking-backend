import { AuthController } from './AuthController';
import { RegisterUser } from '../../application/use-cases/RegisterUser';
import { LoginUser } from '../../application/use-cases/LoginUser';
import { Request, Response } from 'express';

describe('AuthController', () => {
  let authController: AuthController;
  let registerUser: jest.Mocked<RegisterUser>;
  let loginUser: jest.Mocked<LoginUser>;

  beforeEach(() => {
    registerUser = {
      execute: jest.fn(),
    } as any;

    loginUser = {
      execute: jest.fn(),
    } as any;

    authController = new AuthController(registerUser, loginUser);
  });

  it('should register user successfully', async () => {
    const mockUser = {
      id: 'user-1',
      name: 'John',
      email: 'john@example.com',
      role: 'Customer',
      createdAt: new Date(),
    };

    registerUser.execute.mockResolvedValue(mockUser);

    const mockReq = {
      body: {
        name: 'John',
        email: 'john@example.com',
        password: 'password123',
        role: 'Customer',
      },
    } as any;

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    await authController.register(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalled();
  });

  it('should register admin successfully', async () => {
    const mockAdmin = {
      id: 'admin-1',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'Admin',
      createdAt: new Date(),
    };

    registerUser.execute.mockResolvedValue(mockAdmin);

    const mockReq = {
      body: {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'adminpass123',
      },
    } as any;

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    await authController.registerAdmin(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(registerUser.execute).toHaveBeenCalledWith({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'adminpass123',
      role: 'Admin',
    });
  });

  it('should login user successfully', async () => {
    const mockUser = {
      id: 'user-1',
      name: 'John',
      email: 'john@example.com',
      role: 'Customer',
    };

    const mockToken = 'jwt_token_here';

    loginUser.execute.mockResolvedValue({ user: mockUser, token: mockToken });

    const mockReq = {
      body: {
        email: 'john@example.com',
        password: 'password123',
      },
    } as any;

    const mockRes = {
      json: jest.fn(),
    } as any;

    await authController.login(mockReq, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith({
      user: expect.any(Object),
      token: mockToken,
    });
  });

  it('should handle registration error', async () => {
    registerUser.execute.mockRejectedValue(new Error('User already exists'));

    const mockReq = {
      body: {
        name: 'Duplicate',
        email: 'duplicate@example.com',
        password: 'pass',
      },
    } as any;

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    await authController.register(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
  });
});
import { Request, Response } from 'express';
import { AuthController } from './AuthController';

describe('AuthController', () => {
  const mockRegisterUser = { execute: jest.fn() };
  const mockLoginUser = { execute: jest.fn() };
  let controller: AuthController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    controller = new AuthController(mockRegisterUser as any, mockLoginUser as any);
    mockRequest = { body: {} };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  it('should return 201 when registration succeeds', async () => {
    mockRegisterUser.execute.mockResolvedValue({
      id: 'user-1',
      name: 'Astronaut',
      email: 'astro@mars.com',
      role: 'Customer',
      createdAt: new Date(),
    });

    mockRequest.body = { email: 'astro@mars.com', password: 'pass', name: 'Astronaut', role: 'Customer' };

    await controller.register(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({
      id: 'user-1',
      name: 'Astronaut',
      email: 'astro@mars.com',
      role: 'Customer',
      createdAt: expect.any(Date),
    });
  });

  it('should return 400 when registration fails', async () => {
    mockRegisterUser.execute.mockRejectedValue(new Error('Email is already registered.'));
    mockRequest.body = { email: 'taken@mars.com', password: 'pass', name: 'Taken' };

    await controller.register(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Email is already registered.' });
  });

  it('should return 200 with token when login succeeds', async () => {
    const mockUser = { id: 'user-1', name: 'Astronaut', email: 'astro@mars.com', role: 'Customer' };
    mockLoginUser.execute.mockResolvedValue({ user: mockUser, token: 'jwt.token.value' });
    mockRequest.body = { email: 'astro@mars.com', password: 'pass' };

    await controller.login(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).not.toHaveBeenCalled(); // default 200
    expect(mockResponse.json).toHaveBeenCalledWith({
      user: { id: 'user-1', name: 'Astronaut', email: 'astro@mars.com', role: 'Customer' },
      token: 'jwt.token.value',
    });
  });

  it('should return 401 when login fails', async () => {
    mockLoginUser.execute.mockRejectedValue(new Error('Invalid email or password.'));
    mockRequest.body = { email: 'astro@mars.com', password: 'wrong' };

    await controller.login(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid email or password.' });
  });
});
