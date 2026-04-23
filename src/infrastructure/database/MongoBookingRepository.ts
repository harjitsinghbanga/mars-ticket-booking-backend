import mongoose, { Schema, Document } from 'mongoose';
import { Booking } from '../../domain/entities/Booking';
import { BookingRepository } from '../../domain/repositories/BookingRepository';

interface BookingDocument extends Document {
  userId: string;
  destination: string;
  departureDate: Date;
  returnDate?: Date;
  passengerName: string;
  seatNumber: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'decline';
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<BookingDocument>({
  userId: { type: String, required: true },
  destination: { type: String, required: true },
  departureDate: { type: Date, required: true },
  returnDate: { type: Date },
  passengerName: { type: String, required: true },
  seatNumber: { type: String, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'decline'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const BookingModel = mongoose.model<BookingDocument>('Booking', BookingSchema);

export class MongoBookingRepository implements BookingRepository {
  async create(booking: Booking): Promise<Booking> {
    const bookingDoc = new BookingModel({
      userId: booking.userId,
      destination: booking.destination,
      departureDate: booking.departureDate,
      returnDate: booking.returnDate,
      passengerName: booking.passengerName,
      seatNumber: booking.seatNumber,
      status: booking.status,
    });
    const savedDoc = await bookingDoc.save();
    return new Booking(
      savedDoc._id.toString(),
      savedDoc.userId,
      savedDoc.destination,
      savedDoc.departureDate,
      savedDoc.returnDate,
      savedDoc.passengerName,
      savedDoc.seatNumber,
      savedDoc.status,
      savedDoc.createdAt,
      savedDoc.updatedAt
    );
  }

  async findById(id: string): Promise<Booking | null> {
    const bookingDoc = await BookingModel.findById(id);
    if (!bookingDoc) return null;
    return new Booking(
      bookingDoc._id.toString(),
      bookingDoc.userId,
      bookingDoc.destination,
      bookingDoc.departureDate,
      bookingDoc.returnDate,
      bookingDoc.passengerName,
      bookingDoc.seatNumber,
      bookingDoc.status,
      bookingDoc.createdAt,
      bookingDoc.updatedAt
    );
  }

  async findByUserId(userId: string): Promise<Booking[]> {
    const bookingDocs = await BookingModel.find({ userId });
    return bookingDocs.map(doc => new Booking(
      doc._id.toString(),
      doc.userId,
      doc.destination,
      doc.departureDate,
      doc.returnDate,
      doc.passengerName,
      doc.seatNumber,
      doc.status,
      doc.createdAt,
      doc.updatedAt
    ));
  }

  async updateStatus(id: string, status: 'pending' | 'confirmed' | 'cancelled' | 'decline'): Promise<Booking | null> {
    const updatedDoc = await BookingModel.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true }
    );
    if (!updatedDoc) return null;
    return new Booking(
      updatedDoc._id.toString(),
      updatedDoc.userId,
      updatedDoc.destination,
      updatedDoc.departureDate,
      updatedDoc.returnDate,
      updatedDoc.passengerName,
      updatedDoc.seatNumber,
      updatedDoc.status,
      updatedDoc.createdAt,
      updatedDoc.updatedAt
    );
  }

  async findAll(): Promise<Booking[]> {
    const bookingDocs = await BookingModel.find();
    return bookingDocs.map(doc => new Booking(
      doc._id.toString(),
      doc.userId,
      doc.destination,
      doc.departureDate,
      doc.returnDate,
      doc.passengerName,
      doc.seatNumber,
      doc.status,
      doc.createdAt,
      doc.updatedAt
    ));
  }
}
    const bookingDocs = await BookingModel.find().lean();
    return bookingDocs as unknown as Booking[];
  }

  async updateStatus(id: string, status: 'pending' | 'confirmed' | 'cancelled' | 'decline'): Promise<Booking | null> {
    const bookingDoc = await BookingModel.findOneAndUpdate(
      { id },
      { status, updatedAt: new Date() },
      { new: true }
    ).lean();
    if (!bookingDoc) return null;
    return bookingDoc as unknown as Booking;
  }
}