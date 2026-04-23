import { Request, Response } from 'express';
import { Ticket } from '../../domain/entities/Ticket';

export class TicketController {
  async getTicket(req: Request, res: Response): Promise<void> {
    try {
      const bookingId = String(req.params.bookingId);
      if (!bookingId) {
        res.status(400).json({ error: 'bookingId is required' });
        return;
      }

      const ticket = new Ticket(
        undefined,
        bookingId,
        `TICKET-${Date.now()}`,
        new Date()
      );
      res.json({
        id: ticket.id,
        bookingId: ticket.bookingId,
        ticketNumber: ticket.ticketNumber,
        issuedAt: ticket.issuedAt,
      });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}