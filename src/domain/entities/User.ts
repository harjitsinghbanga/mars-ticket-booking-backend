export interface User {
  id?: string;
  name?: string;
  email: string;
  passwordHash: string;
  role: 'Customer' | 'Admin';
  createdAt?: Date;
}