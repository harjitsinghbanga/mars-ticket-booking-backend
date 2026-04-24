import { createAdminRouter } from './adminRoutes';
import { InMemoryUserRepository } from '../../infrastructure/database/InMemoryUserRepository';

describe('Admin Routes', () => {
  let userRepository: InMemoryUserRepository;
  let router: any;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    router = createAdminRouter(userRepository);
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