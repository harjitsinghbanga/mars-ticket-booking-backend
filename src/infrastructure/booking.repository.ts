import type { Launch } from '../domain/booking.entity.js';
import type { PendingBooking } from '../domain/pending-booking.entity.js';

export class BookingRepository {
  private launches: Launch[] = [
    { id: 1, date: "2026-06-15", seatsAvailable: 50 },
    { id: 2, date: "2026-07-20", seatsAvailable: 30 },
    { id: 3, date: "2026-08-10", seatsAvailable: 20 }
  ];
  private pendingBookings: PendingBooking[] = [];
  private nextPendingId = 1;

  getAllLaunches() { return this.launches; }
  
  reduceSeats(launchId: number) {
    const launch = this.launches.find(l => l.id === launchId);
    if (launch && launch.seatsAvailable > 0) launch.seatsAvailable--;
  }

  createPending(launchId: number, userId?: number): PendingBooking {
    const pending: PendingBooking = {
      id: this.nextPendingId++,
      launchId,
      userId,
      status: 'pending'
    };
    this.pendingBookings.push(pending);
    return pending;
  }

  getPendingById(id: number): PendingBooking | undefined {
    return this.pendingBookings.find(p => p.id === id);
  }

  updatePendingStatus(id: number, status: 'approved' | 'declined') {
    const pending = this.pendingBookings.find(p => p.id === id);
    if (pending) pending.status = status;
  }
}