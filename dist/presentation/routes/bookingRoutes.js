"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const BookingController_1 = require("../controllers/BookingController");
const CreateBooking_1 = require("../../application/use-cases/CreateBooking");
const InMemoryBookingRepository_1 = require("../../infrastructure/database/InMemoryBookingRepository");
const router = (0, express_1.Router)();
// 1. Wire all the layers together!
const repository = new InMemoryBookingRepository_1.InMemoryBookingRepository();
const createBookingUseCase = new CreateBooking_1.CreateBooking(repository);
const bookingController = new BookingController_1.BookingController(createBookingUseCase);
// 2. Define the POST route
router.post('/', async (req, res) => {
    await bookingController.createBooking(req, res);
});
// Test GET route
router.get('/', (req, res) => res.send('Bookings GET'));
exports.default = router;
