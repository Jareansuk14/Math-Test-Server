import { Request, Response } from 'express';
import { z } from 'zod';
import { publishQuestionSetSchema, upsertQuestionSchema } from '../validators/question.schema';
import { Question } from '../models/Question';
import { QuestionSet } from '../models/QuestionSet';
import { Student } from '../models/Student';
import { ExamResult } from '../models/ExamResult';
import { getPresignedUploadUrl, getPresignedViewUrl } from '../services/s3.service';

export async function publishQuestionSet(req: Request, res: Response) {
  const parsed = publishQuestionSetSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
  const { version, questions } = parsed.data;

  const exists = await QuestionSet.findOne({ version });
  if (exists) return res.status(409).json({ message: 'Version already exists' });

  await Question.insertMany(
    questions.map((q, idx) => ({
      setVersion: version,
      index: idx + 1,
      promptText: q.promptText,
      promptImageUrl: q.promptImageUrl,
      choices: q.choices,
      correctIndex: q.correctIndex,
      hints: q.hints,
      firstTryExplanation: q.firstTryExplanation,
    }))
  );
  await QuestionSet.create({ version, isActive: true });
  // deactivate previous versions
  await QuestionSet.updateMany({ version: { $ne: version } }, { $set: { isActive: false } });

  return res.json({ message: 'Published', version });
}

export async function listStudents(_req: Request, res: Response) {
  const items = await Student.find().sort({ createdAt: -1 }).lean();
  // Transform ObjectId to string for frontend compatibility
  const transformedItems = items.map(item => ({
    ...item,
    id: item._id.toString()
  }));
  res.json(transformedItems);
}

export async function listResults(_req: Request, res: Response) {
  const items = await ExamResult.find().sort({ completedAt: -1 }).lean();
  // Transform ObjectId to string for frontend compatibility
  const transformedItems = items.map(item => ({
    ...item,
    _id: item._id.toString(),
    studentId: item.studentId.toString(),
    perQuestion: item.perQuestion.map(pq => ({
      ...pq,
      questionId: pq.questionId.toString()
    }))
  }));
  res.json(transformedItems);
}

export async function getUploadUrl(req: Request, res: Response) {
  const schema = z.object({ key: z.string().min(1), contentType: z.string().min(1) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
  const url = getPresignedUploadUrl(parsed.data.key, parsed.data.contentType);
  res.json({ url });
}

export async function getViewUrl(req: Request, res: Response) {
  const schema = z.object({ key: z.string().min(1) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
  const url = getPresignedViewUrl(parsed.data.key);
  res.json({ url });
}
