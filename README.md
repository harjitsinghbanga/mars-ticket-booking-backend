# Mars Ticket Booking API

A comprehensive ticket booking system for Mars travel, built with TypeScript, Express.js, and MongoDB.

## Features

- User registration and authentication with JWT
- Booking management with role-based access control
- Admin capabilities for booking status updates
- Clean Architecture implementation
- Comprehensive test coverage
- MongoDB integration

## Tech Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Testing**: Jest
- **Logging**: Winston

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd mars_ticket_booking
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```
   MONGODB_URI=mongodb://localhost:27017/mars_ticket_booking
   JWT_SECRET=your-secret-key
   PORT=3000
   ```

4. Start MongoDB service

5. Run the application:
   ```bash
   npm run dev
   ```

### Running Tests

```bash
npm test
```

### Building for Production

```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user

### Bookings
- `POST /api/bookings` - Create a new booking (authenticated)
- `GET /api/bookings` - Get user's bookings (authenticated)
- `PATCH /api/bookings/:id` - Update booking status (admin only)
- `GET /api/bookings/all` - Get all bookings (authenticated)

## Project Structure

```
src/
├── application/
│   └── use-cases/          # Business logic
├── domain/
│   ├── entities/           # Domain models
│   └── repositories/       # Repository interfaces
├── infrastructure/
│   └── database/           # Database implementations
└── presentation/
    ├── controllers/        # HTTP controllers
    ├── middleware/         # Express middleware
    └── routes/             # Route definitions
```

## Architecture

This project follows Clean Architecture principles:

- **Domain Layer**: Contains business entities and repository interfaces
- **Application Layer**: Contains use cases that orchestrate business logic
- **Infrastructure Layer**: Contains external concerns like database implementations
- **Presentation Layer**: Contains HTTP controllers and routes

## Testing

The project includes comprehensive unit and integration tests with Jest, achieving 85%+ code coverage.

## License

MIT