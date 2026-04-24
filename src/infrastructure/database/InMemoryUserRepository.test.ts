import { InMemoryUserRepository } from './InMemoryUserRepository';
import { User } from '../../domain/entities/User';

describe('InMemoryUserRepository', () => {
  let repository: InMemoryUserRepository;

  beforeEach(() => {
    repository = new InMemoryUserRepository();
  });

  it('should create a user', async () => {
    const user: User = {
      id: undefined,
      name: 'John Doe',
      email: 'john@example.com',
      passwordHash: 'hashedpassword',
      role: 'Customer',
      createdAt: new Date(),
    };

    const result = await repository.create(user);
    expect(result.id).toBeDefined();
    expect(result.email).toBe('john@example.com');
  });

  it('should find user by email', async () => {
    const user: User = {
      id: undefined,
      name: 'Jane Doe',
      email: 'jane@example.com',
      passwordHash: 'hashedpassword',
      role: 'Customer',
      createdAt: new Date(),
    };

    const created = await repository.create(user);
    const found = await repository.findByEmail('jane@example.com');
    expect(found?.id).toBe(created.id);
  });

  it('should find user by id', async () => {
    const user: User = {
      id: undefined,
      name: 'Bob Smith',
      email: 'bob@example.com',
      passwordHash: 'hashedpassword',
      role: 'Admin',
      createdAt: new Date(),
    };

    const created = await repository.create(user);
    const found = await repository.findById(created.id!);
    expect(found?.id).toBe(created.id);
  });

  it('should return null for nonexistent user', async () => {
    const found = await repository.findByEmail('nonexistent@example.com');
    expect(found).toBeNull();
  });
});
