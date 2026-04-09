"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CreateBooking_1 = require("./CreateBooking");
// 1. Create a "Fake" Database for testing
class MockBookingRepository {
    async create(booking) {
        return { ...booking, id: 'mars-ticket-999' }; // Fake saving the ticket
    }
    async findById(id) { return null; }
    async findAll() { return []; }
    async updateStatus(id, status) { return null; }
}
describe('CreateBooking Use Case', () => {
    let createBooking;
    let mockRepo;
    beforeEach(() => {
        mockRepo = new MockBookingRepository();
        createBooking = new CreateBooking_1.CreateBooking(mockRepo);
    });
    it('should successfully create a new booking if the date is in the future', async () => {
        const futureDate = new Date();
        futureDate.setFullYear(futureDate.getFullYear() + 1); // Set to 1 year from today
        const newTicket = {
            userId: 'user_123',
            launchDate: futureDate,
            seatClass: 'Economy',
            status: 'Pending' // Even if they try to bypass, the logic should reset it
        };
        const result = await createBooking.execute(newTicket);
        expect(result.id).toBe('mars-ticket-999');
        expect(result.status).toBe('Pending');
    });
    it('should throw an error if the launch date is in the past', async () => {
        const pastDate = new Date('2020-01-01'); // A date in the past
        const badTicket = {
            userId: 'user_123',
            launchDate: pastDate,
            seatClass: 'VIP-Pod',
            status: 'Pending'
        };
        // Expect the execution to fail with our specific error message
        await expect(createBooking.execute(badTicket)).rejects.toThrow('Launch date cannot be in the past.');
    });
});
