export interface Booking {
  id?: string;
  userId: string | null; // null if they book as a guest
  launchDate: Date;
  seatClass: 'Economy' | 'First-Class' | 'VIP-Pod';
  status: 'Pending' | 'Confirmed' | 'Declined';
  createdAt?: Date;
}