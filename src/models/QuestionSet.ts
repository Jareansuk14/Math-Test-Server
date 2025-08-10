import { Schema, model, Document } from 'mongoose';

export interface QuestionSetDocument extends Document {
  version: number;
  isActive: boolean;
  updatedAt: Date;
}

const questionSetSchema = new Schema<QuestionSetDocument>({
  version: { type: Number, required: true, unique: true },
  isActive: { type: Boolean, default: false },
  updatedAt: { type: Date, default: Date.now },
});

export const QuestionSet = model<QuestionSetDocument>('QuestionSet', questionSetSchema);
