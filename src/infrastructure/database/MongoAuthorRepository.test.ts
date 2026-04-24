import { MongoAuthorRepository } from './MongoAuthorRepository';
import { Author } from '../../domain/entities/Author';
import mongoose from 'mongoose';

jest.mock('mongoose', () => ({
  Schema: jest.fn(),
  model: jest.fn(),
}));

describe('MongoAuthorRepository', () => {
  let repository: MongoAuthorRepository;
  let mockModel: any;

  beforeEach(() => {
    mockModel = {
      save: jest.fn(),
      findOne: jest.fn(),
      findById: jest.fn(),
    };
    (mongoose.model as jest.Mock).mockReturnValue(mockModel);
    repository = new MongoAuthorRepository();
  });

  it('should create an author', async () => {
    const author: Author = {
      id: '1',
      name: 'Test Author',
      email: 'test@example.com',
      passwordHash: 'hash',
      role: 'Author',
      createdAt: new Date(),
    };

    const savedDoc = {
      _id: { toString: () => '1' },
      name: 'Test Author',
      email: 'test@example.com',
      passwordHash: 'hash',
      role: 'Author',
      createdAt: new Date(),
    };

    mockModel.save.mockResolvedValue(savedDoc);

    const result = await repository.create(author);

    expect(result.id).toBe('1');
    expect(result.name).toBe('Test Author');
  });

  it('should find author by email', async () => {
    const savedDoc = {
      _id: { toString: () => '1' },
      name: 'Test Author',
      email: 'test@example.com',
      passwordHash: 'hash',
      role: 'Author',
      createdAt: new Date(),
    };

    mockModel.findOne.mockResolvedValue(savedDoc);

    const result = await repository.findByEmail('test@example.com');

    expect(result?.email).toBe('test@example.com');
  });

  it('should return null if author not found by email', async () => {
    mockModel.findOne.mockResolvedValue(null);

    const result = await repository.findByEmail('notfound@example.com');

    expect(result).toBeNull();
  });

  it('should find author by id', async () => {
    const savedDoc = {
      _id: { toString: () => '1' },
      name: 'Test Author',
      email: 'test@example.com',
      passwordHash: 'hash',
      role: 'Author',
      createdAt: new Date(),
    };

    mockModel.findById.mockResolvedValue(savedDoc);

    const result = await repository.findById('1');

    expect(result?.id).toBe('1');
  });

  it('should return null if author not found by id', async () => {
    mockModel.findById.mockResolvedValue(null);

    const result = await repository.findById('999');

    expect(result).toBeNull();
  });
});