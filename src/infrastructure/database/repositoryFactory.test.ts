import { getBookingRepository, getUserRepository, getAuthorRepository, setUseMongoDB } from './repositoryFactory';
import { InMemoryBookingRepository } from './InMemoryBookingRepository';
import { InMemoryUserRepository } from './InMemoryUserRepository';
import { InMemoryAuthorRepository } from './InMemoryAuthorRepository';
import { MongoBookingRepository } from './MongoBookingRepository';
import { MongoUserRepository } from './MongoUserRepository';
import { MongoAuthorRepository } from './MongoAuthorRepository';

describe('Repository Factory', () => {
  beforeEach(() => {
    setUseMongoDB(false); // Reset to default
  });

  it('should return InMemoryBookingRepository by default', () => {
    const repo = getBookingRepository();
    expect(repo).toBeInstanceOf(InMemoryBookingRepository);
  });

  it('should return MongoBookingRepository when useMongoDB is true', () => {
    setUseMongoDB(true);
    const repo = getBookingRepository();
    expect(repo).toBeInstanceOf(MongoBookingRepository);
  });

  it('should return InMemoryUserRepository by default', () => {
    const repo = getUserRepository();
    expect(repo).toBeInstanceOf(InMemoryUserRepository);
  });

  it('should return MongoUserRepository when useMongoDB is true', () => {
    setUseMongoDB(true);
    const repo = getUserRepository();
    expect(repo).toBeInstanceOf(MongoUserRepository);
  });

  it('should return InMemoryAuthorRepository by default', () => {
    const repo = getAuthorRepository();
    expect(repo).toBeInstanceOf(InMemoryAuthorRepository);
  });

  it('should return MongoAuthorRepository when useMongoDB is true', () => {
    setUseMongoDB(true);
    const repo = getAuthorRepository();
    expect(repo).toBeInstanceOf(MongoAuthorRepository);
  });
});