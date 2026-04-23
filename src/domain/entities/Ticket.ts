export class Ticket {
  id?: string;
  bookingId: string;
  ticketNumber: string;
  issuedAt: Date;

  constructor(
    id: string | undefined,
    bookingId: string,
    ticketNumber: string,
    issuedAt: Date
  ) {
    if (id !== undefined) this.id = id;
    this.bookingId = bookingId;
    this.ticketNumber = ticketNumber;
    this.issuedAt = issuedAt;
  }
}export interface Ticket {
  id?: string;
  passengerName: string;
  destination: string; // e.g., "Olympus Mons"
  launchDate: Date;
  seatNumber: string;
}