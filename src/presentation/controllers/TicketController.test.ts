import { TicketController } from './TicketController';

describe('TicketController', () => {
  let controller: TicketController;

  beforeEach(() => {
    controller = new TicketController();
  });

  it('should get ticket successfully', async () => {
    const mockReq = {
      params: { bookingId: 'booking-1' },
    } as any;

    const mockRes = {
      json: jest.fn(),
    } as any;

    await controller.getTicket(mockReq, mockRes);

    expect(mockRes.json).toHaveBeenCalled();
    const response = mockRes.json.mock.calls[0][0];
    expect(response.bookingId).toBe('booking-1');
    expect(response.ticketNumber).toMatch(/^TICKET-/);
  });
});