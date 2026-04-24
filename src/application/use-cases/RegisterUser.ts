import bcrypt from 'bcryptjs';
import { User } from '../../domain/entities/User';
import { UserRepository } from '../../domain/repositories/UserRepository';

export class RegisterUser {
  constructor(private userRepository: UserRepository) {}

  async execute(userData: {
    name?: string;
    email: string;
    password: string;
    role?: 'Customer' | 'Admin';
  }): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(userData.email.toLowerCase());
    if (existingUser) {
      throw new Error('User already exists');
    }

    const passwordHash = await bcrypt.hash(userData.password, 10);
    const user: User = {
      id: undefined,
      name: userData.name,
      email: userData.email.toLowerCase(),
      passwordHash,
      role: userData.role || 'Customer',
      createdAt: new Date(),
    };

    return await this.userRepository.create(user);
  }
}// update
