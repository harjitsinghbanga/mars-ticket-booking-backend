import logger from './logger';

describe('Logger', () => {
  it('should export a winston logger instance', () => {
    expect(logger).toBeDefined();
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.error).toBe('function');
  });
});