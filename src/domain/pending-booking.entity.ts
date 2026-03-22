export interface PendingBooking {
  id: number;
  launchId: number;
  userId: number | undefined; // undefined = guest
  status: 'pending' | 'approved' | 'declined';
}