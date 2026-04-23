import { Author } from '../entities/Author';

export interface AuthorRepository {
  create(author: Author): Promise<Author>;
  findByEmail(email: string): Promise<Author | null>;
  findById(id: string): Promise<Author | null>;
}
