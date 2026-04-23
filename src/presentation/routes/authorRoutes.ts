import { Router } from 'express';
import { AuthorController } from '../controllers/AuthorController';
import { RegisterAuthor } from '../../application/use-cases/RegisterAuthor';
import { LoginAuthor } from '../../application/use-cases/LoginAuthor';
import { AuthorRepository } from '../../domain/repositories/AuthorRepository';

export const createAuthorRouter = (authorRepository: AuthorRepository) => {
  const router = Router();
  const registerAuthor = new RegisterAuthor(authorRepository);
  const loginAuthor = new LoginAuthor(authorRepository);
  const authorController = new AuthorController(registerAuthor, loginAuthor);

  router.post('/register', (req, res) => authorController.register(req, res));
  router.post('/login', (req, res) => authorController.login(req, res));

  return router;
};

export default createAuthorRouter;
