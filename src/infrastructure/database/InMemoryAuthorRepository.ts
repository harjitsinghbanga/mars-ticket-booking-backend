import { Author } from '../../domain/entities/Author';
import { AuthorRepository } from '../../domain/repositories/AuthorRepository';

export class InMemoryAuthorRepository implements AuthorRepository {
  private authors: Author[] = [];

  async create(author: Author): Promise<Author> {
    const newAuthor: Author = {
      id: author.id || `author-${Date.now()}`,
      name: author.name,
      email: author.email,
      passwordHash: author.passwordHash,
      role: author.role,
      createdAt: author.createdAt || new Date(),
    };
    this.authors.push(newAuthor);
    return newAuthor;
  }

  async findByEmail(email: string): Promise<Author | null> {
    return this.authors.find(author => author.email.toLowerCase() === email.toLowerCase()) || null;
  }

  async findById(id: string): Promise<Author | null> {
    return this.authors.find(author => author.id === id) || null;
  }
}
