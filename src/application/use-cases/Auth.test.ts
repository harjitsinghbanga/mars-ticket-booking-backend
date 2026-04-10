import { RegisterUser } from './RegisterUser';
import { LoginUser } from './LoginUser';
import { User } from '../../domain/entities/User';
import { UserRepository } from '../../domain/repositories/UserRepository';
import bcrypt from 'bcryptjs';

// 1. Create a Fake Database for testing
class MockUserRepository implements UserRepository {
  public users: User[] = [];

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find(u => u.email === email) || null;
  }

  async create(user: User): Promise<User> {
    const newUser = { ...user, id: 'user-123' };
    this.users.push(newUser);
    return newUser;
  }
}

describe('Authentication Use Cases', () => {
  let mockRepo: MockUserRepository;
  let registerUser: RegisterUser;
  let loginUser: LoginUser;

  beforeEach(() => {
    mockRepo = new MockUserRepository();
    registerUser = new RegisterUser(mockRepo);
    loginUser = new LoginUser(mockRepo);
  });

  describe('RegisterUser', () => {
    it('should securely register a new user and hide the password', async () => {
      const newUser: User = { email: 'test@mars.com', passwordHash: 'MySecret123', role: 'Customer' };
      
      const result = await registerUser.execute(newUser);

      expect(result.id).toBe('user-123');
      expect(result.email).toBe('test@mars.com');
      expect((result as any).passwordHash).toBeUndefined(); // Ensure password isn't leaked
      
      // Ensure it was actually hashed in the database
      const savedUser = mockRepo.users[0];
      expect(savedUser.passwordHash).not.toBe('MySecret123');
    });

    it('should throw an error if the email is already taken', async () => {
      mockRepo.users.push({ email: 'taken@mars.com', passwordHash: 'hash', role: 'Customer' });
      
      const duplicateUser: User = { email: 'taken@mars.com', passwordHash: 'newPass', role: 'Customer' };
      await expect(registerUser.execute(duplicateUser)).rejects.toThrow('Email is already registered.');
    });
  });

  describe('LoginUser', () => {
    it('should return a JWT token for valid credentials', async () => {
      // Create a fake user with a hashed password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('CorrectPassword', salt);
      mockRepo.users.push({ id: '999', email: 'login@mars.com', passwordHash: hashedPassword, role: 'Customer' });

      const token = await loginUser.execute('login@mars.com', 'CorrectPassword');
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(20); // JWTs are long strings
    });

    it('should throw an error for a bad password', async () => {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('CorrectPassword', salt);
      mockRepo.users.push({ id: '999', email: 'login@mars.com', passwordHash: hashedPassword, role: 'Customer' });

      await expect(loginUser.execute('login@mars.com', 'WrongPassword')).rejects.toThrow('Invalid email or password.');
    });
  });
});