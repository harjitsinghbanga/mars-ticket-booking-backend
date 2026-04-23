export class Booking {
  id?: string;
  userId: string;
  destination: string;
  departureDate: Date;
  returnDate?: Date;
  passengerName: string;
  seatNumber: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'decline' = 'pending';
  createdAt?: Date;
  updatedAt?: Date;

  constructor(
    id: string | undefined,
    userId: string,
    destination: string,
    departureDate: Date,
    returnDate: Date | undefined,
    passengerName: string,
    seatNumber: string,
    status: 'pending' | 'confirmed' | 'cancelled' | 'decline' = 'pending',
    createdAt?: Date,
    updatedAt?: Date
  ) {
    if (id !== undefined) this.id = id;
    this.userId = userId;
    this.destination = destination;
    this.departureDate = departureDate;
    if (returnDate !== undefined) this.returnDate = returnDate;
    this.passengerName = passengerName;
    this.seatNumber = seatNumber;
    this.status = status;
    if (createdAt !== undefined) this.createdAt = createdAt;
    if (updatedAt !== undefined) this.updatedAt = updatedAt;
  }
}export interface Booking {
  id?: string;
  userId: string | null;
  launchDate: Date;
  seatClass: 'Economy' | 'First-Class' | 'VIP-Pod';
  status: 'Pending' | 'Confirmed' | 'Declined';
  createdAt?: Date;
}
