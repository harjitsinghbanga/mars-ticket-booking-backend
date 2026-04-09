"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingController = void 0;
class BookingController {
    createBookingUseCase;
    constructor(createBookingUseCase) {
        this.createBookingUseCase = createBookingUseCase;
    }
    async createBooking(req, res) {
        console.log('Received booking request:', req.body);
        try {
            // 1. Grab data from the web request body
            const bookingData = req.body;
            // 2. Pass it to the Use Case (The Brains)
            const result = await this.createBookingUseCase.execute(bookingData);
            // 3. Send success response
            res.status(201).json({ message: 'Mars Ticket booked successfully!', ticket: result });
        }
        catch (error) {
            console.log('Error:', error.message);
            // 4. Send error if business rules fail (like time travel)
            res.status(400).json({ error: error.message });
        }
    }
}
exports.BookingController = BookingController;
