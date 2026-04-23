export interface Author {
  id?: string;
  name?: string;
  email: string;
  passwordHash: string;
  role: 'Author';
  createdAt?: Date;
}
