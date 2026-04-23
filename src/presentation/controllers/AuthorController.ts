import { Request, Response } from 'express';
import { RegisterAuthor } from '../../application/use-cases/RegisterAuthor';
import { LoginAuthor } from '../../application/use-cases/LoginAuthor';

export class AuthorController {
  constructor(
    private registerAuthor: RegisterAuthor,
    private loginAuthor: LoginAuthor
  ) {}

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body;
      const author = await this.registerAuthor.execute({ name, email, password });
      res.status(201).json({
        id: author.id,
        name: author.name,
        email: author.email,
        role: author.role,
        createdAt: author.createdAt,
      });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const { author, token } = await this.loginAuthor.execute({ email, password });
      res.json({
        author: {
          id: author.id,
          name: author.name,
          email: author.email,
          role: author.role,
        },
        token,
      });
    } catch (error) {
      res.status(401).json({ error: (error as Error).message });
    }
  }
}
