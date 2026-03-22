import type { Request, Response } from 'express';
import { LoginUseCase } from '../application/login.use-case.js';
import { UserRepository } from '../infrastructure/user.repository.js';
import { logger } from '../infrastructure/logger.js';

const repo = new UserRepository();
const loginUseCase = new LoginUseCase(repo);

export const login = (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    logger.warn('Login attempt missing username or password');
    return res.status(400).send('Username and password required');
  }

  const result = loginUseCase.execute(username, password);
  if (result.success) {
    logger.info(`Successful login for user: ${username}`);
    res.send({
      message: result.message,
      user: result.user
    });
  } else {
    logger.error(`Failed login for ${username}: ${result.message}`);
    res.status(401).send(result.message);
  }
};