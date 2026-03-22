import { UserRepository } from '../infrastructure/user.repository.js';

export class LoginUseCase {
  constructor(private repo: UserRepository) {}

  execute(username: string, password: string): { success: boolean; message: string; user?: { id: number; username: string; isAdmin: boolean } } {
    const user = this.repo.findByUsername(username);
    if (!user) {
      return { success: false, message: 'User not found' };
    }
    if (user.password !== password) {
      return { success: false, message: 'Wrong password' };
    }
    return { success: true, message: 'Login successful', user: { id: user.id, username: user.username, isAdmin: user.isAdmin } };
  }
}