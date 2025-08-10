import { Schema, model, Document, Types } from 'mongoose';

interface Attempt {
  choiceIndex: number;
  isCorrect: boolean;
  timestamp: Date;
}

interface QuestionProgress {
  questionId: Types.ObjectId;
  attempts: Attempt[];
}

export interface ExamSessionDocument extends Document {
  studentId: Types.ObjectId;
  setVersion: number;
  perQuestionProgress: QuestionProgress[];
  startedAt: Date;
  status: 'in_progress';
}

const attemptSchema = new Schema<Attempt>({
  choiceIndex: { type: Number, required: true },
  isCorrect: { type: Boolean, required: true },
  timestamp: { type: Date, required: true },
});

const progressSchema = new Schema<QuestionProgress>({
  questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
  attempts: { type: [attemptSchema], default: [] },
});

const examSessionSchema = new Schema<ExamSessionDocument>({
  studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
  setVersion: { type: Number, required: true },
  perQuestionProgress: { type: [progressSchema], default: [] },
  startedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['in_progress'], default: 'in_progress' },
});

export const ExamSession = model<ExamSessionDocument>('ExamSession', examSessionSchema);
