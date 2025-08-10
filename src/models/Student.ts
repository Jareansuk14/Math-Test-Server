import { Schema, model, Document } from 'mongoose';

export interface StudentDocument extends Document {
  studentId: string;
  name: string;
  school: string;
  createdAt: Date;
}

const studentSchema = new Schema<StudentDocument>({
  studentId: { type: String, unique: true, required: true, index: true },
  name: { type: String, required: true },
  school: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Student = model<StudentDocument>('Student', studentSchema);
