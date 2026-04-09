"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const bookingRoutes_1 = __importDefault(require("./presentation/routes/bookingRoutes"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/bookings', bookingRoutes_1.default); // <-- Added this line!
console.log('Booking routes loaded', typeof bookingRoutes_1.default);
// Test route
app.post('/test', (req, res) => res.send('test'));
// A simple test route
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Mars Ticket Booking API is running! 🚀' });
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
