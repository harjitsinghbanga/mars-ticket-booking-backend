import { BookingRepository } from '../infrastructure/booking.repository.js';
import { logger } from '../infrastructure/logger.js';

export class BookTicketUseCase {
  constructor(private repository: BookingRepository) {}

  execute(launchId: number, userId?: number): string {
  logger.info(`Booking attempt for launch ${launchId} by ${userId ? 'user ' + userId : 'guest'}`);

  const launches = this.repository.getAllLaunches();
  const launch = launches.find(l => l.id === launchId);

  if (!launch) {
    logger.error(`Launch ${launchId} not found`);
    return "Launch not found";
  }
  if (launch.seatsAvailable === 0) {
    logger.warn(`No seats left for launch ${launchId}`);
    return "No seats left";
  }

  this.repository.reduceSeats(launchId);
  const msg = userId 
    ? `Registered user (ID ${userId}) booked ticket for launch ${launchId} on ${launch.date}`
    : `Guest booked ticket for launch ${launchId} on ${launch.date}`;
  
  logger.info(msg);
  return msg;
}}