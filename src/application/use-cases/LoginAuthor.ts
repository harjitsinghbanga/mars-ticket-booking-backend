import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Author } from '../../domain/entities/Author';
import { AuthorRepository } from '../../domain/repositories/AuthorRepository';

export class LoginAuthor {
  constructor(private authorRepository: AuthorRepository) {}

  async execute(credentials: { email: string; password: string }): Promise<{ author: Author; token: string }> {
    const author = await this.authorRepository.findByEmail(credentials.email.toLowerCase());
    if (!author) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(credentials.password, author.passwordHash);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { userId: author.id, role: author.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    return { author, token };
  }
}
