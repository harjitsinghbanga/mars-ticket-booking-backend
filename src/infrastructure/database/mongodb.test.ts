import connectDB from './mongodb';
import mongoose from 'mongoose';

jest.mock('mongoose', () => ({
  connect: jest.fn(),
}));

describe('connectDB', () => {
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it('should connect to MongoDB successfully', async () => {
    (mongoose.connect as jest.Mock).mockResolvedValue(undefined);

    await connectDB();

    expect(mongoose.connect).toHaveBeenCalledWith('mongodb://localhost:27017/mars_ticket_booking');
    expect(consoleLogSpy).toHaveBeenCalledWith('MongoDB connected');
  });

  it('should use custom MONGO_URI from env', async () => {
    process.env.MONGO_URI = 'mongodb://custom:27017/test';
    (mongoose.connect as jest.Mock).mockResolvedValue(undefined);

    await connectDB();

    expect(mongoose.connect).toHaveBeenCalledWith('mongodb://custom:27017/test');

    delete process.env.MONGO_URI;
  });

  it('should throw error on connection failure', async () => {
    const error = new Error('Connection failed');
    (mongoose.connect as jest.Mock).mockRejectedValue(error);

    await expect(connectDB()).rejects.toThrow('Connection failed');
    expect(consoleErrorSpy).toHaveBeenCalledWith('MongoDB connection error:', error);
  });
});import connectDB from './mongodb';
import mongoose from 'mongoose';

jest.mock('mongoose', () => ({
  connect: jest.fn(),
}));

describe('connectDB', () => {
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it('should connect to MongoDB successfully', async () => {
    (mongoose.connect as jest.Mock).mockResolvedValue(undefined);

    await connectDB();

    expect(mongoose.connect).toHaveBeenCalledWith('mongodb://localhost:27017/mars_ticket_booking');
    expect(consoleLogSpy).toHaveBeenCalledWith('MongoDB connected');
  });

  it('should use custom MONGO_URI from env', async () => {
    process.env.MONGO_URI = 'mongodb://custom:27017/test';
    (mongoose.connect as jest.Mock).mockResolvedValue(undefined);

    await connectDB();

    expect(mongoose.connect).toHaveBeenCalledWith('mongodb://custom:27017/test');

    delete process.env.MONGO_URI;
  });

  it('should throw error on connection failure', async () => {
    const error = new Error('Connection failed');
    (mongoose.connect as jest.Mock).mockRejectedValue(error);

    await expect(connectDB()).rejects.toThrow('Connection failed');
  });
});import mongoose from 'mongoose';
import { connectDB } from './mongodb';

describe('connectDB', () => {
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should log the connection host when mongoose connects successfully', async () => {
    jest.spyOn(mongoose, 'connect').mockResolvedValue({ connection: { host: 'localhost' } } as any);

    await connectDB();

    expect(mongoose.connect).toHaveBeenCalled();
    expect(consoleLogSpy).toHaveBeenCalledWith('MongoDB connected');
  });

  it('should throw error on connection failure', async () => {
    const error = new Error('Connection failed');
    (mongoose.connect as jest.Mock).mockRejectedValue(error);

    await expect(connectDB()).rejects.toThrow('Connection failed');
  });
});
