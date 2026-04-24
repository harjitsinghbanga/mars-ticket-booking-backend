import { createAuthorRouter } from './authorRoutes';
import { InMemoryAuthorRepository } from '../../infrastructure/database/InMemoryAuthorRepository';

describe('Author Routes', () => {
  let authorRepository: InMemoryAuthorRepository;
  let router: any;

  beforeEach(() => {
    authorRepository = new InMemoryAuthorRepository();
    router = createAuthorRouter(authorRepository);
  });

  it('should create a router with POST /register route', () => {
    expect(router.stack).toBeDefined();
    const registerRoute = router.stack.find((layer: any) => layer.route?.path === '/register' && layer.route?.methods?.post);
    expect(registerRoute).toBeDefined();
  });

  it('should create a router with POST /login route', () => {
    expect(router.stack).toBeDefined();
    const loginRoute = router.stack.find((layer: any) => layer.route?.path === '/login' && layer.route?.methods?.post);
    expect(loginRoute).toBeDefined();
  });
});