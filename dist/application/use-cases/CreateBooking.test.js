"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CreateBooking_1 = require("./CreateBooking");
class MockBookingRepository {
    async create(booking) {
        return { ...booking, id: 'mars-ticket-999' };
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
        futureDate.setFullYear(futureDate.getFullYear() + 1);
        const newTicket = {
            userId: 'user_123',
            launchDate: futureDate,
            seatClass: 'Economy',
            status: 'Pending'
        };
        const result = await createBooking.execute(newTicket);
        expect(result.id).toBe('mars-ticket-999');
        expect(result.status).toBe('Pending');
    });
    it('should throw an error if the launch date is in the past', async () => {
        const pastDate = new Date('2020-01-01');
        const badTicket = {
            userId: 'user_123',
            launchDate: pastDate,
            seatClass: 'VIP-Pod',
            status: 'Pending'
        };
        await expect(createBooking.execute(badTicket)).rejects.toThrow('Launch date cannot be in the past.');
    });
});
