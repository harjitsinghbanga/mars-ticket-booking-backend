import { Request, Response } from 'express';
import { RegisterUser } from '../../application/use-cases/RegisterUser';
import { LoginUser } from '../../application/use-cases/LoginUser';

export class AuthController {
  constructor(
    private registerUser: RegisterUser,
    private loginUser: LoginUser
  ) {}

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password, role } = req.body;
      const user = await this.registerUser.execute({ name, email, password, role });
      res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async registerAdmin(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body;
      const user = await this.registerUser.execute({
        name,
        email,
        password,
        role: 'Admin',
      });
      res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const { user, token } = await this.loginUser.execute({ email, password });
      res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      });
    } catch (error) {
      res.status(401).json({ error: (error as Error).message });
    }
  }
}