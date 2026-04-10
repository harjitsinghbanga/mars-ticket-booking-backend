import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../../domain/repositories/UserRepository';

export class LoginUser {
  constructor(private userRepository: UserRepository) {}

  async execute(email: string, plainPassword: string): Promise<string> {
    // 1. Find the user
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password.');
    }

    // 2. Check if the password matches the hash
    const isMatch = await bcrypt.compare(plainPassword, user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid email or password.'); 
    }

    // 3. Generate the JWT (The Digital Badge)
    const secret = process.env.JWT_SECRET || 'mars_super_secret_key_123';
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role }, 
      secret,
      { expiresIn: '1h' } 
    );

    return token;
  }
}