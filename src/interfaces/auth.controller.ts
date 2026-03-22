import type { Request, Response } from 'express';
import { LoginUseCase } from '../application/login.use-case.js';
import { UserRepository } from '../infrastructure/user.repository.js';

const repo = new UserRepository();
const loginUseCase = new LoginUseCase(repo);

export const login = (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send('Username and password required');
  }

  const result = loginUseCase.execute(username, password);
  if (result.success) {
    res.send({
      message: result.message,
      user: result.user
    });
  } else {
    res.status(401).send(result.message);
  }
};