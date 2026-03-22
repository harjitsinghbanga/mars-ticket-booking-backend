import type { Request, Response } from 'express';
import { BookTicketUseCase } from '../application/book-ticket.use-case.js';
import { BookingRepository } from '../infrastructure/booking.repository.js';

export const repo = new BookingRepository();
const useCase = new BookTicketUseCase(repo);

// We'll simulate logged-in user from a global variable for now (very simple)
export let currentUser: { id: number; isAdmin: boolean } | null = null;

export const bookTicket = (req: Request, res: Response) => {
  const { launchId } = req.body;
  if (!launchId) return res.status(400).send('launchId required');

  const result = useCase.execute(launchId, currentUser ? currentUser.id : undefined);
  res.send(result);
};

// Simple helper to set current user after login (for demo only)
export const setCurrentUser = (user: { id: number; isAdmin: boolean } | null) => {
  currentUser = user;
};

// Getter for current user
export const getCurrentUser = () => currentUser;