import { Schema, model, Document } from 'mongoose';

export interface AdminUserDocument extends Document {
  email: string;
  passwordHash: string;
  role: 'admin';
  createdAt: Date;
}

const adminUserSchema = new Schema<AdminUserDocument>({
  email: { type: String, unique: true, required: true, index: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin'], default: 'admin' },
  createdAt: { type: Date, default: Date.now },
});

export const AdminUser = model<AdminUserDocument>('AdminUser', adminUserSchema);
