import { BookingRepository } from '../infrastructure/booking.repository.js';

export class BookTicketUseCase {
  constructor(private repository: BookingRepository) {}

  execute(launchId: number, userId?: number): string {
    const launches = this.repository.getAllLaunches();
    const launch = launches.find(l => l.id === launchId);

    if (!launch) return "Launch not found";
    if (launch.seatsAvailable === 0) return "No seats left";

    this.repository.reduceSeats(launchId);

    if (userId) {
      return `Registered user (ID ${userId}) booked ticket for launch ${launchId} on ${launch.date}`;
    } else {
      return `Guest booked ticket for launch ${launchId} on ${launch.date}`;
    }
  }
}