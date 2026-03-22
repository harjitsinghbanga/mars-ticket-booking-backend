import type { Request, Response } from 'express';
import { BookTicketUseCase } from '../application/book-ticket.use-case.js';
import { BookingRepository } from '../infrastructure/booking.repository.js';

const repo = new BookingRepository();
const useCase = new BookTicketUseCase(repo);

export const bookTicket = (req: Request, res: Response) => {
  const { launchId } = req.body;
  const result = useCase.execute(launchId);
  res.send(result);
};