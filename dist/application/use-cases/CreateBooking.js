"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateBooking = void 0;
// The "export" word right here is what TypeScript is looking for!
class CreateBooking {
    bookingRepository;
    constructor(bookingRepository) {
        this.bookingRepository = bookingRepository;
    }
    async execute(bookingData) {
        if (new Date(bookingData.launchDate) < new Date()) {
            throw new Error('Launch date cannot be in the past.');
        }
        bookingData.status = 'Pending';
        bookingData.createdAt = new Date();
        return await this.bookingRepository.create(bookingData);
    }
}
exports.CreateBooking = CreateBooking;
