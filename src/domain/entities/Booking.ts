export interface Booking {
  id?: string;
  userId: string | null;
  launchDate: Date;
  seatClass: 'Economy' | 'First-Class' | 'VIP-Pod';
  status: 'Pending' | 'Confirmed' | 'Declined';
  createdAt?: Date;
}
