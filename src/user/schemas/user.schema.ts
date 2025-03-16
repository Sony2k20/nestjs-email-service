import { Schema, Document } from 'mongoose';

export const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  status: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export class User extends Document {
  email: string;
  status: number;
  createdAt: Date;
}
