import { AuthorController } from './AuthorController';
import { RegisterAuthor } from '../../application/use-cases/RegisterAuthor';
import { LoginAuthor } from '../../application/use-cases/LoginAuthor';

describe('AuthorController', () => {
  let authorController: AuthorController;
  let registerAuthor: jest.Mocked<RegisterAuthor>;
  let loginAuthor: jest.Mocked<LoginAuthor>;

  beforeEach(() => {
    registerAuthor = {
      execute: jest.fn(),
    } as any;

    loginAuthor = {
      execute: jest.fn(),
    } as any;

    authorController = new AuthorController(registerAuthor, loginAuthor);
  });

  it('should register author successfully', async () => {
    const mockAuthor = {
      id: 'author-1',
      name: 'Author Name',
      email: 'author@example.com',
      role: 'Author',
      createdAt: new Date(),
    };

    registerAuthor.execute.mockResolvedValue(mockAuthor);

    const mockReq = {
      body: {
        name: 'Author Name',
        email: 'author@example.com',
        password: 'password123',
      },
    } as any;

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    await authorController.register(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalled();
  });

  it('should login author successfully', async () => {
    const mockAuthor = {
      id: 'author-1',
      name: 'Author',
      email: 'author@example.com',
      role: 'Author',
    };

    const mockToken = 'jwt_token';

    loginAuthor.execute.mockResolvedValue({ author: mockAuthor, token: mockToken });

    const mockReq = {
      body: {
        email: 'author@example.com',
        password: 'password123',
      },
    } as any;

    const mockRes = {
      json: jest.fn(),
    } as any;

    await authorController.login(mockReq, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith({
      author: expect.any(Object),
      token: mockToken,
    });
  });

  it('should handle registration error', async () => {
    registerAuthor.execute.mockRejectedValue(new Error('Author already exists'));

    const mockReq = {
      body: {
        name: 'Existing',
        email: 'existing@example.com',
        password: 'pass',
      },
    } as any;

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    await authorController.register(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
  });

  it('should handle login error', async () => {
    loginAuthor.execute.mockRejectedValue(new Error('Invalid credentials'));

    const mockReq = {
      body: {
        email: 'wrong@example.com',
        password: 'wrong',
      },
    } as any;

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    await authorController.login(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(401);
  });
});
