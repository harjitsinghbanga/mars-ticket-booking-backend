import { MongoUserRepository } from './MongoUserRepository';
import { User } from '../../domain/entities/User';
import mongoose from 'mongoose';

jest.mock('mongoose', () => ({
  Schema: jest.fn(),
  model: jest.fn(),
}));

describe('MongoUserRepository', () => {
  let repository: MongoUserRepository;
  let mockModel: any;

  beforeEach(() => {
    mockModel = {
      save: jest.fn(),
      findOne: jest.fn(),
      findById: jest.fn(),
    };
    (mongoose.model as jest.Mock).mockReturnValue(mockModel);
    repository = new MongoUserRepository();
  });

  it('should create a user', async () => {
    const user: User = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      passwordHash: 'hash',
      role: 'Customer',
      createdAt: new Date(),
    };

    const savedDoc = {
      _id: { toString: () => '1' },
      name: 'Test User',
      email: 'test@example.com',
      passwordHash: 'hash',
      role: 'Customer',
      createdAt: new Date(),
    };

    mockModel.save.mockResolvedValue(savedDoc);

    const result = await repository.create(user);

    expect(result.id).toBe('1');
    expect(result.name).toBe('Test User');
  });

  it('should find user by email', async () => {
    const savedDoc = {
      _id: { toString: () => '1' },
      name: 'Test User',
      email: 'test@example.com',
      passwordHash: 'hash',
      role: 'Customer',
      createdAt: new Date(),
    };

    mockModel.findOne.mockResolvedValue(savedDoc);

    const result = await repository.findByEmail('test@example.com');

    expect(result?.email).toBe('test@example.com');
  });

  it('should return null if user not found by email', async () => {
    mockModel.findOne.mockResolvedValue(null);

    const result = await repository.findByEmail('notfound@example.com');

    expect(result).toBeNull();
  });

  it('should find user by id', async () => {
    const savedDoc = {
      _id: { toString: () => '1' },
      name: 'Test User',
      email: 'test@example.com',
      passwordHash: 'hash',
      role: 'Customer',
      createdAt: new Date(),
    };

    mockModel.findById.mockResolvedValue(savedDoc);

    const result = await repository.findById('1');

    expect(result?.id).toBe('1');
  });

  it('should return null if user not found by id', async () => {
    mockModel.findById.mockResolvedValue(null);

    const result = await repository.findById('999');

    expect(result).toBeNull();
  });
});import mongoose from 'mongoose';
import { MongoUserRepository } from './MongoBookingRepository';

describe('MongoUserRepository', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should find a user by email', async () => {
    const user = { id: 'user-2', email: 'test@mars.com', passwordHash: 'hash', role: 'Customer' };
    const UserModel = mongoose.model('User');
    const findOneSpy = jest.spyOn(UserModel, 'findOne' as any).mockReturnValue({ lean: () => Promise.resolve(user) } as any);

    const repository = new MongoUserRepository();
    const result = await repository.findByEmail('test@mars.com');

    expect(findOneSpy).toHaveBeenCalledWith({ email: 'test@mars.com' });
    expect(result).toEqual(user);
  });

  it('should return null when findByEmail does not find a user', async () => {
    const UserModel = mongoose.model('User');
    jest.spyOn(UserModel, 'findOne' as any).mockReturnValue({ lean: () => Promise.resolve(null) } as any);

    const repository = new MongoUserRepository();
    const result = await repository.findByEmail('missing@mars.com');

    expect(result).toBeNull();
  });
});
