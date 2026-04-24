import { LoginUser } from './LoginUser';
import { InMemoryUserRepository } from '../../infrastructure/database/InMemoryUserRepository';
import { User } from '../../domain/entities/User';
import bcrypt from 'bcryptjs';

describe('LoginUser', () => {
  let loginUser: LoginUser;
  let userRepository: InMemoryUserRepository;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    loginUser = new LoginUser(userRepository);
  });

  it('should login user with correct credentials', async () => {
    const passwordHash = await bcrypt.hash('password123', 10);
    const user: User = {
      id: undefined,
      name: 'John',
      email: 'john@example.com',
      passwordHash,
      role: 'Customer',
      createdAt: new Date(),
    };

    await userRepository.create(user);

    const result = await loginUser.execute({
      email: 'john@example.com',
      password: 'password123',
    });

    expect(result.token).toBeDefined();
    expect(result.user.email).toBe('john@example.com');
  });

  it('should reject login with wrong password', async () => {
    const passwordHash = await bcrypt.hash('password123', 10);
    const user: User = {
      id: undefined,
      name: 'Jane',
      email: 'jane@example.com',
      passwordHash,
      role: 'Customer',
      createdAt: new Date(),
    };

    await userRepository.create(user);

    await expect(
      loginUser.execute({
        email: 'jane@example.com',
        password: 'wrongpassword',
      })
    ).rejects.toThrow('Invalid credentials');
  });

  it('should reject login for nonexistent user', async () => {
    await expect(
      loginUser.execute({
        email: 'nonexistent@example.com',
        password: 'password123',
      })
    ).rejects.toThrow('Invalid credentials');
  });
});
