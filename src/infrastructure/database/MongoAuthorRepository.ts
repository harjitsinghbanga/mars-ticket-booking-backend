import mongoose, { Schema, Document } from 'mongoose';
import { Author } from '../../domain/entities/Author';
import { AuthorRepository } from '../../domain/repositories/AuthorRepository';

interface AuthorDocument extends Document {
  name?: string;
  email: string;
  passwordHash: string;
  role: 'Author';
  createdAt: Date;
}

const AuthorSchema = new Schema<AuthorDocument>({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['Author'], default: 'Author' },
  createdAt: { type: Date, default: Date.now },
});

const AuthorModel = mongoose.model<AuthorDocument>('Author', AuthorSchema);

export class MongoAuthorRepository implements AuthorRepository {
  async create(author: Author): Promise<Author> {
    const authorDoc = new AuthorModel({
      name: author.name,
      email: author.email,
      passwordHash: author.passwordHash,
      role: author.role,
    });
    const savedDoc = await authorDoc.save();
    return {
      id: savedDoc._id.toString(),
      name: savedDoc.name,
      email: savedDoc.email,
      passwordHash: savedDoc.passwordHash,
      role: savedDoc.role,
      createdAt: savedDoc.createdAt,
    };
  }

  async findByEmail(email: string): Promise<Author | null> {
    const authorDoc = await AuthorModel.findOne({ email: email.toLowerCase() });
    if (!authorDoc) return null;
    return {
      id: authorDoc._id.toString(),
      name: authorDoc.name,
      email: authorDoc.email,
      passwordHash: authorDoc.passwordHash,
      role: authorDoc.role,
      createdAt: authorDoc.createdAt,
    };
  }

  async findById(id: string): Promise<Author | null> {
    const authorDoc = await AuthorModel.findById(id);
    if (!authorDoc) return null;
    return {
      id: authorDoc._id.toString(),
      name: authorDoc.name,
      email: authorDoc.email,
      passwordHash: authorDoc.passwordHash,
      role: authorDoc.role,
      createdAt: authorDoc.createdAt,
    };
  }
}
