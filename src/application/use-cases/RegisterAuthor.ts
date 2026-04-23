import bcrypt from 'bcryptjs';
import { Author } from '../../domain/entities/Author';
import { AuthorRepository } from '../../domain/repositories/AuthorRepository';

export class RegisterAuthor {
  constructor(private authorRepository: AuthorRepository) {}

  async execute(authorData: {
    name?: string;
    email: string;
    password: string;
  }): Promise<Author> {
    const existingAuthor = await this.authorRepository.findByEmail(authorData.email.toLowerCase());
    if (existingAuthor) {
      throw new Error('Author already exists');
    }

    const passwordHash = await bcrypt.hash(authorData.password, 10);
    const author: Author = {
      id: undefined,
      name: authorData.name,
      email: authorData.email.toLowerCase(),
      passwordHash,
      role: 'Author',
      createdAt: new Date(),
    };

    return await this.authorRepository.create(author);
  }
}
