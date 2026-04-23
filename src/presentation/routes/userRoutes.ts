import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { RegisterUser } from '../../application/use-cases/RegisterUser';
import { LoginUser } from '../../application/use-cases/LoginUser';
import { UserRepository } from '../../domain/repositories/UserRepository';

export const createUserRouter = (userRepository: UserRepository) => {
  const router = Router();
  const registerUser = new RegisterUser(userRepository);
  const loginUser = new LoginUser(userRepository);
  const authController = new AuthController(registerUser, loginUser);

  router.post('/register', (req, res) => authController.register(req, res));
  router.post('/login', (req, res) => authController.login(req, res));

  return router;
};

export default createUserRouter;