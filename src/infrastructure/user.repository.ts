type User = {
  id: number;
  username: string;
  password: string;
  isAdmin: boolean;
};

export class UserRepository {
  private users: User[] = [
    { id: 1, username: 'admin', password: 'admin123', isAdmin: true },
    { id: 2, username: 'user1', password: 'pass123', isAdmin: false }
  ];

  findByUsername(username: string): User | undefined {
    return this.users.find(u => u.username === username);
  }
}