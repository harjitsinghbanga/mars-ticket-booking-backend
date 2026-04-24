import { LoginAuthor } from './LoginAuthor';
import { InMemoryAuthorRepository } from '../../infrastructure/database/InMemoryAuthorRepository';
import bcrypt from 'bcryptjs';

describe('LoginAuthor', () => {
  let loginAuthor: LoginAuthor;
  let authorRepository: InMemoryAuthorRepository;

  beforeEach(() => {
    authorRepository = new InMemoryAuthorRepository();
    loginAuthor = new LoginAuthor(authorRepository);
  });

  it('should login author successfully', async () => {
    const hashedPassword = await bcrypt.hash('password123', 10);
    const author = await authorRepository.create({
      id: 'author-1',
      name: 'Author Name',
      email: 'author@example.com',
      passwordHash: hashedPassword,
      role: 'Author',
    });

    const result = await loginAuthor.execute({ email: 'author@example.com', password: 'password123' });

    expect(result.author).toEqual(author);
    expect(result.token).toBeDefined();
  });

  it('should throw error for invalid email', async () => {
    await expect(loginAuthor.execute({ email: 'invalid@example.com', password: 'password123' })).rejects.toThrow('Invalid credentials');
  });

  it('should throw error for invalid password', async () => {
    const hashedPassword = await bcrypt.hash('password123', 10);
    await authorRepository.create({
      id: 'author-1',
      name: 'Author Name',
      email: 'author@example.com',
      passwordHash: hashedPassword,
      role: 'Author',
    });

    await expect(loginAuthor.execute({ email: 'author@example.com', password: 'wrongpassword' })).rejects.toThrow('Invalid credentials');
  });
});