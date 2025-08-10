import { Schema, model, Document, Types } from 'mongoose';

interface Attempt {
  choiceIndex: number;
  isCorrect: boolean;
  timestamp: Date;
}

interface QuestionResult {
  questionId: Types.ObjectId;
  firstAttemptCorrect: boolean;
  wrongAttemptsCount: number;
  attempts: Attempt[];
}

export interface ExamResultDocument extends Document {
  studentId: Types.ObjectId;
  setVersion: number;
  perQuestion: QuestionResult[];
  realScore: number; // 0-20
  startedAt: Date;
  completedAt: Date;
}

const attemptSchema = new Schema<Attempt>({
  choiceIndex: { type: Number, required: true },
  isCorrect: { type: Boolean, required: true },
  timestamp: { type: Date, required: true },
});

const questionResultSchema = new Schema<QuestionResult>({
  questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
  firstAttemptCorrect: { type: Boolean, required: true },
  wrongAttemptsCount: { type: Number, required: true },
  attempts: { type: [attemptSchema], default: [] },
});

const examResultSchema = new Schema<ExamResultDocument>({
  studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
  setVersion: { type: Number, required: true },
  perQuestion: { type: [questionResultSchema], default: [] },
  realScore: { type: Number, required: true },
  startedAt: { type: Date, required: true },
  completedAt: { type: Date, required: true },
});

export const ExamResult = model<ExamResultDocument>('ExamResult', examResultSchema);
