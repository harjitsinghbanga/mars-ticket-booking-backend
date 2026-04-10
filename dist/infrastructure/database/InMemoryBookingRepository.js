"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryBookingRepository = void 0;
class InMemoryBookingRepository {
    bookings = [];
    async create(booking) {
        const newBooking = { ...booking, id: `mars-${Math.floor(Math.random() * 10000)}` };
        this.bookings.push(newBooking);
        return newBooking;
    }
    async findById(id) { return null; }
    async findAll() { return []; }
    async updateStatus(id, status) { return null; }
}
exports.InMemoryBookingRepository = InMemoryBookingRepository;
