import mongoose, { Schema, Document } from 'mongoose';
import { User } from '../../domain/entities/User';
import { UserRepository } from '../../domain/repositories/UserRepository';

interface UserDocument extends Document {
  name?: string;
  email: string;
  passwordHash: string;
  role: 'Customer' | 'Admin';
  createdAt: Date;
}

const UserSchema = new Schema<UserDocument>({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['Customer', 'Admin'], default: 'Customer' },
  createdAt: { type: Date, default: Date.now },
});

const UserModel = mongoose.model<UserDocument>('User', UserSchema);

export class MongoUserRepository implements UserRepository {
  async create(user: User): Promise<User> {
    const userDoc = new UserModel({
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
      role: user.role,
    });
    const savedDoc = await userDoc.save();
    return {
      id: savedDoc._id.toString(),
      name: savedDoc.name,
      email: savedDoc.email,
      passwordHash: savedDoc.passwordHash,
      role: savedDoc.role,
      createdAt: savedDoc.createdAt,
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    const userDoc = await UserModel.findOne({ email: email.toLowerCase() });
    if (!userDoc) return null;
    return {
      id: userDoc._id.toString(),
      name: userDoc.name,
      email: userDoc.email,
      passwordHash: userDoc.passwordHash,
      role: userDoc.role,
      createdAt: userDoc.createdAt,
    };
  }

  async findById(id: string): Promise<User | null> {
    const userDoc = await UserModel.findById(id);
    if (!userDoc) return null;
    return {
      id: userDoc._id.toString(),
      name: userDoc.name,
      email: userDoc.email,
      passwordHash: userDoc.passwordHash,
      role: userDoc.role,
      createdAt: userDoc.createdAt,
    };
  }
}