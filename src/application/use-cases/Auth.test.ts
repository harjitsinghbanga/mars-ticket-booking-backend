import { RegisterUser } from './RegisterUser';
import { LoginUser } from './LoginUser';
import { InMemoryUserRepository } from '../../infrastructure/database/InMemoryUserRepository';

describe('Auth Use Cases', () => {
  let registerUser: RegisterUser;
  let loginUser: LoginUser;
  let userRepository: InMemoryUserRepository;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    registerUser = new RegisterUser(userRepository);
    loginUser = new LoginUser(userRepository);
  });

  describe('RegisterUser', () => {
    it('should register a user successfully', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      const user = await registerUser.execute(userData);

      expect(user).toBeDefined();
      expect(user.email).toBe(userData.email.toLowerCase());
      expect(user.name).toBe(userData.name);
      expect(user.role).toBe('Customer');
    });

    it('should throw error if user already exists', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      await registerUser.execute(userData);

      await expect(registerUser.execute(userData)).rejects.toThrow('User already exists');
    });
  });

  describe('LoginUser', () => {
    it('should login user with correct credentials', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      await registerUser.execute(userData);

      const result = await loginUser.execute({
        email: 'john@example.com',
        password: 'password123',
      });

      expect(result.user).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result.user.email).toBe(userData.email.toLowerCase());
    });

    it('should throw error with invalid credentials', async () => {
      await expect(loginUser.execute({
        email: 'nonexistent@example.com',
        password: 'wrongpassword',
      })).rejects.toThrow('Invalid credentials');
    });
  });
});