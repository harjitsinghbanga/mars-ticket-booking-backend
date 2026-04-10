"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingController = void 0;
class BookingController {
    createBookingUseCase;
    constructor(createBookingUseCase) {
        this.createBookingUseCase = createBookingUseCase;
    }
    async createBooking(req, res) {
        try {
            const bookingData = req.body;
            const result = await this.createBookingUseCase.execute(bookingData);
            res.status(201).json({ message: 'Mars Ticket booked successfully!', ticket: result });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
exports.BookingController = BookingController;
