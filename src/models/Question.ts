import { Schema, model, Document, Types } from 'mongoose';

interface Hint {
  level: 1 | 2 | 3;
  text: string;
  imageUrl?: string;
}

export interface QuestionDocument extends Document {
  setVersion: number;
  index: number; // 1-20
  promptText: string;
  promptImageUrl?: string;
  choices: { text: string }[]; // length 4
  correctIndex: number; // 0-3
  hints: Hint[]; // 3 levels
  firstTryExplanation?: { text: string; imageUrl?: string };
  updatedAt: Date;
}

const hintSchema = new Schema<Hint>({
  level: { type: Number, enum: [1, 2, 3], required: true },
  text: { type: String, required: true },
  imageUrl: { type: String },
});

const questionSchema = new Schema<QuestionDocument>({
  setVersion: { type: Number, required: true, index: true },
  index: { type: Number, required: true, min: 1, max: 20, index: true },
  promptText: { type: String, required: true },
  promptImageUrl: { type: String },
  choices: [{ text: { type: String, required: true } }],
  correctIndex: { type: Number, required: true, min: 0, max: 3 },
  hints: { type: [hintSchema], default: [] },
  firstTryExplanation: { text: { type: String }, imageUrl: { type: String } },
  updatedAt: { type: Date, default: Date.now },
});

questionSchema.index({ setVersion: 1, index: 1 }, { unique: true });

export const Question = model<QuestionDocument>('Question', questionSchema);
