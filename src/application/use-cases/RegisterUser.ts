import bcrypt from 'bcryptjs';
import { User } from '../../domain/entities/User';
import { UserRepository } from '../../domain/repositories/UserRepository';

export class RegisterUser {
  constructor(private userRepository: UserRepository) {}

  // We omit the passwordHash from the return value so it NEVER gets sent back to the browser
  async execute(userData: User): Promise<Omit<User, 'passwordHash'>> {
    // 1. Check if email is already taken
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email is already registered.');
    }

    // 2. Hash the password (encrypt it)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.passwordHash, salt);

    // 3. Create the secure user object
    const newUser: User = {
      email: userData.email,
      passwordHash: hashedPassword,
      role: userData.role || 'Customer',
      createdAt: new Date()
    };

    // 4. Save to the database
    const savedUser = await this.userRepository.create(newUser);

    // 5. Strip the password before returning the result
    const { passwordHash, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }
}