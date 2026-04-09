"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateBooking = void 0;
class CreateBooking {
    bookingRepository;
    // We inject the repository so this logic doesn't care what database we use later
    constructor(bookingRepository) {
        this.bookingRepository = bookingRepository;
    }
    async execute(bookingData) {
        // Business Rule 1: No time travel allowed
        if (new Date(bookingData.launchDate) < new Date()) {
            throw new Error('Launch date cannot be in the past.');
        }
        // Business Rule 2: All new bookings must start as 'Pending'
        bookingData.status = 'Pending';
        bookingData.createdAt = new Date();
        // Save to the database
        return await this.bookingRepository.create(bookingData);
    }
}
exports.CreateBooking = CreateBooking;
