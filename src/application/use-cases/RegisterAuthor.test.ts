import { RegisterAuthor } from './RegisterAuthor';
import { InMemoryAuthorRepository } from '../../infrastructure/database/InMemoryAuthorRepository';

describe('RegisterAuthor', () => {
  let registerAuthor: RegisterAuthor;
  let authorRepository: InMemoryAuthorRepository;

  beforeEach(() => {
    authorRepository = new InMemoryAuthorRepository();
    registerAuthor = new RegisterAuthor(authorRepository);
  });

  it('should register author successfully', async () => {
    const result = await registerAuthor.execute({
      name: 'Author Name',
      email: 'author@example.com',
      password: 'password123',
    });

    expect(result.id).toBeDefined();
    expect(result.email).toBe('author@example.com');
    expect(result.role).toBe('Author');
  });

  it('should reject duplicate author registration', async () => {
    await registerAuthor.execute({
      name: 'Author 1',
      email: 'duplicate@example.com',
      password: 'password123',
    });

    await expect(
      registerAuthor.execute({
        name: 'Author 2',
        email: 'duplicate@example.com',
        password: 'password123',
      })
    ).rejects.toThrow('Author already exists');
  });

  it('should handle email case-insensitively', async () => {
    await registerAuthor.execute({
      name: 'Test Author',
      email: 'Test@Example.Com',
      password: 'password123',
    });

    await expect(
      registerAuthor.execute({
        name: 'Another Author',
        email: 'test@example.com',
        password: 'password123',
      })
    ).rejects.toThrow('Author already exists');
  });
});
