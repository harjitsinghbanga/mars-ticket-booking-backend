"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryBookingRepository = void 0;
class InMemoryBookingRepository {
    bookings = [];
    async create(booking) {
        const newBooking = { ...booking, id: `booking-${Math.floor(Math.random() * 10000)}` };
        this.bookings.push(newBooking);
        return newBooking;
    }
    async findById(id) {
        const booking = this.bookings.find(b => b.id === id);
        return booking || null;
    }
    async findAll() {
        return this.bookings;
    }
    async updateStatus(id, status) {
        const booking = this.bookings.find(b => b.id === id);
        if (booking) {
            booking.status = status;
        }
        return booking || null;
    }
}
exports.InMemoryBookingRepository = InMemoryBookingRepository;
