import { BookingRepository } from '../../domain/repositories/BookingRepository';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { AuthorRepository } from '../../domain/repositories/AuthorRepository';
import { MongoBookingRepository } from './MongoBookingRepository';
import { MongoUserRepository } from './MongoUserRepository';
import { MongoAuthorRepository } from './MongoAuthorRepository';
import { InMemoryBookingRepository } from './InMemoryBookingRepository';
import { InMemoryUserRepository } from './InMemoryUserRepository';
import { InMemoryAuthorRepository } from './InMemoryAuthorRepository';

let useMongoDB = false;

export const setUseMongoDB = (value: boolean): void => {
  useMongoDB = value;
};

export const getBookingRepository = (): BookingRepository => {
  return useMongoDB ? new MongoBookingRepository() : new InMemoryBookingRepository();
};

export const getUserRepository = (): UserRepository => {
  return useMongoDB ? new MongoUserRepository() : new InMemoryUserRepository();
};

export const getAuthorRepository = (): AuthorRepository => {
  return useMongoDB ? new MongoAuthorRepository() : new InMemoryAuthorRepository();
};