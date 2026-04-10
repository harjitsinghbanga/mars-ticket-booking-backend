import { UserRepository } from '../../domain/repositories/UserRepository';
import { User } from '../../domain/entities/User';

export class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find(u => u.email === email);
    return user || null;
  }

  async create(user: User): Promise<User> {
    const newUser = { ...user, id: `user-${Math.floor(Math.random() * 10000)}` };
    this.users.push(newUser);
    return newUser;
  }
}